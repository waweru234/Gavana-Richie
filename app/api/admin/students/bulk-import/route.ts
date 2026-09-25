import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

function generateSlug(name: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  return `${cleanName}-${randomSuffix}`
}

function getGoogleDriveFileId(url: string): string | null {
  // Handle various Google Drive URL formats:
  // https://drive.google.com/open?id=FILE_ID
  // https://drive.google.com/file/d/FILE_ID/view
  // https://drive.google.com/open?id=FILE_ID&usp=sharing
  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com') || url.includes('docs.google.com')
}

function toGoogleDriveDirectUrl(url: string): string | null {
  if (isGoogleDriveUrl(url)) {
    const fileId = getGoogleDriveFileId(url)
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
  }
  return url.startsWith('http') ? url : null
}

async function downloadAndUploadImage(url: string, folder: string, supabase: any): Promise<string | null> {
  if (!url || !url.trim()) return null

  try {
    const directUrl = toGoogleDriveDirectUrl(url.trim())
    if (!directUrl) return null

    const response = await fetch(directUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`)

    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const extension = contentType.split('/')[1] || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`

    const formData = new FormData()
    formData.append('file', blob, fileName)
    formData.append('folder', folder)

    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'}/api/admin/upload`, {
      method: 'POST',
      body: formData,
    })

    const uploadData = await uploadRes.json()
    if (uploadData.error) throw new Error(uploadData.error)

    return uploadData.url
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

function getCellValue(row: any, keys: string[]): string {
  const trimmedKeys = keys.map(k => k.trim())
  for (const key of Object.keys(row)) {
    const trimmedKey = key.trim()
    if (trimmedKeys.includes(trimmedKey)) {
      const val = row[key]
      return val != null ? String(val) : ''
    }
  }
  for (const key of keys) {
    if (row[key] != null) return String(row[key])
  }
  return ''
}

function parseExcelRow(row: any, index: number): any {
  return {
    name: getCellValue(row, ['Name', 'name', 'Student Name', 'student_name', ' FULL NAME ', 'Full Name', 'full_name']),
    school: getCellValue(row, ['School', 'school', 'Institution', 'institution', 'college', 'College']) || 'Lionhill Vocational Centre',
    need: getCellValue(row, ['Need', 'need', 'Funding Need', 'funding_need', 'Amount', 'amount', 'Fees', 'fees']),
    paybill: getCellValue(row, ['Paybill', 'paybill', 'Pay Bill', 'pay_bill']) || '600100',
    account: getCellValue(row, ['Account', 'account', 'Account Number', 'account_number', 'ADM. NUMBER', 'adm_number', ' Adm. Number']) || getCellValue(row, ['ADM. NUMBER', 'Adm Number', 'adm_number']),
    tag: getCellValue(row, ['Tag', 'tag', 'Study Area', 'study_area', 'Course', 'course', 'COURSE']) || '',
    number: getCellValue(row, ['Number', 'number', 'Student Number', 'student_number', 'ADM. NUMBER', 'adm_number', 'Adm. Number']) || getCellValue(row, [' ADM. NUMBER', 'Admission Number']) || String(index + 1),
    short: getCellValue(row, ['Short', 'short', 'Short Description', 'short_description', 'Bio', 'bio']) || '',
    bio: getCellValue(row, ['Bio', 'bio', 'Description', 'description', 'Short', 'short']),
    image: getCellValue(row, ['Image', 'image', 'Photo', 'photo', 'STUDENT  PHOTO', 'Student Photo', 'student_photo', 'Image URL', 'image_url', 'Photo URL', 'photo_url']),
    poster: getCellValue(row, ['Poster', 'poster', 'Poster Image', 'poster_image', 'Poster URL', 'poster_url']) || '',
    sponsored: false,
    sponsoredBy: getCellValue(row, ['Sponsored By', 'sponsored_by', 'Sponsor', 'sponsor']) || '',
    sponsoredDate: getCellValue(row, ['Sponsored Date', 'sponsored_date', 'Date Sponsored', 'date_sponsored']) || '',
    sponsoredQuote: getCellValue(row, ['Sponsored Quote', 'sponsored_quote', 'Quote', 'quote']) || '',
    published: getCellValue(row, ['Published', 'published']) !== 'false',
    sort_order: parseInt(getCellValue(row, ['Sort Order', 'sort_order', 'Order', 'order']) || '0') || 0,
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const formData = await request.formData()
    const file = formData.get('file') as File
    const autoUploadImages = formData.get('autoUploadImages') === 'true'
    const defaultSchool = formData.get('defaultSchool')?.toString() || ''
    const defaultNeed = formData.get('defaultNeed')?.toString() || 'KSh 5,000'
    const defaultPaybill = formData.get('defaultPaybill')?.toString() || '600100'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: 'File must be an Excel file (.xlsx or .xls)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    if (!jsonData || jsonData.length === 0) {
      return NextResponse.json({ error: 'Excel file is empty or has no data rows' }, { status: 400 })
    }

    const results = []
    const errors = []

    for (let i = 0; i < jsonData.length; i++) {
      try {
        const row = jsonData[i]
        const parsed = parseExcelRow(row, i)

        // Fill in defaults for missing required fields
        if (!parsed.school || parsed.school === '') parsed.school = defaultSchool || 'Lionhill Vocational Centre'
        if (!parsed.need || parsed.need === '') parsed.need = defaultNeed
        if (!parsed.paybill || parsed.paybill === '') parsed.paybill = defaultPaybill
        if (!parsed.account || parsed.account === '') parsed.account = parsed.number

        // Trim all string fields
        for (const key of Object.keys(parsed)) {
          if (typeof parsed[key] === 'string') {
            parsed[key] = parsed[key].trim()
          }
        }

        const requiredFields = ['name', 'tag']
        const missingFields = requiredFields.filter(field => !parsed[field]?.toString().trim())

        if (missingFields.length > 0) {
          errors.push({ row: i + 2, error: `Missing required fields: ${missingFields.join(', ')}` })
          continue
        }

        let imageUrl = parsed.image?.trim() || null
        let posterUrl = parsed.poster?.trim() || null

        if (autoUploadImages) {
          if (imageUrl && imageUrl.startsWith('http')) {
            const uploaded = await downloadAndUploadImage(imageUrl, 'students', supabase)
            if (uploaded) imageUrl = uploaded
          }
          if (posterUrl && posterUrl.startsWith('http')) {
            const uploaded = await downloadAndUploadImage(posterUrl, 'students', supabase)
            if (uploaded) posterUrl = uploaded
          }
        }

        const slug = generateSlug(parsed.name)
        const now = new Date().toISOString()

        const bioArray = parsed.bio ? parsed.bio.split('\n').map((b: string) => b.trim()).filter(Boolean) : []

        const { data, error } = await supabase
          .from('students')
          .insert({
            slug,
            name: parsed.name.trim(),
            school: parsed.school.trim(),
            need: parsed.need.trim(),
            paybill: parsed.paybill.trim(),
            account: parsed.account.trim(),
            image: imageUrl,
            poster: posterUrl || imageUrl,
            tag: parsed.tag.trim(),
            number: parsed.number.trim(),
            short: parsed.short?.trim() || null,
            bio: bioArray.length > 0 ? bioArray : [],
            sponsored: parsed.sponsored,
            sponsored_by: parsed.sponsoredBy?.trim() || null,
            sponsored_date: parsed.sponsoredDate?.trim() || null,
            sponsored_quote: parsed.sponsoredQuote?.trim() || null,
            published: parsed.published,
            sort_order: parsed.sort_order,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single()

        if (error) {
          if (error.code === '23505') {
            errors.push({ row: i + 2, error: 'A student with this slug already exists' })
          } else {
            errors.push({ row: i + 2, error: error.message })
          }
          continue
        }

        results.push(data)
      } catch (err) {
        errors.push({ row: i + 2, error: err instanceof Error ? err.message : 'Unknown error' })
      }
    }

    return NextResponse.json({
      success: results.length,
      errors: errors.length,
      data: results,
      errorDetails: errors,
    }, { status: errors.length > 0 && results.length === 0 ? 400 : 200 })

  } catch (error) {
    console.error('Error bulk importing students:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}