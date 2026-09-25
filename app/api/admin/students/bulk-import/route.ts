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
  // Handle Google Drive links pasted into cells or stored as Excel hyperlinks.
  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /\/uc\/(?:export\/)?download\/([a-zA-Z0-9_-]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractUrl(value: unknown): string {
  const text = value == null ? '' : String(value).trim()
  if (!text) return ''
  // Excel often contains a display label followed by the real URL.
  const url = text.split(/\s+/).find(part => part.startsWith('http://') || part.startsWith('https://'))
  return (url || text).replace(/[),.;]+$/, '')
}

function addExcelHyperlinks(rows: any[], worksheet: XLSX.WorkSheet): any[] {
  const range = worksheet['!ref']
  if (!range) return rows
  const decoded = XLSX.utils.decode_range(range)
  const headers: string[] = []
  for (let column = decoded.s.c; column <= decoded.e.c; column++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: decoded.s.r, c: column })]
    headers[column] = cell?.v == null ? '' : String(cell.v).trim()
  }

  return rows.map((row, rowIndex) => {
    const enriched = { ...row }
    const worksheetRow = decoded.s.r + rowIndex + 1
    headers.forEach((header, column) => {
      if (!header) return
      const cell = worksheet[XLSX.utils.encode_cell({ r: worksheetRow, c: column })]
      const target = cell?.l?.Target || cell?.l?.target
      if (target) enriched[header] = target
    })
    return enriched
  })
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

async function downloadAndUploadImage(url: string, folder: string, supabase: any): Promise<{ url: string | null; error: string | null }> {
  if (!url || !url.trim()) return { url: null, error: 'Image URL is empty' }

  try {
    const directUrl = toGoogleDriveDirectUrl(url.trim())
    if (!directUrl) return { url: null, error: 'Image URL is not a valid HTTP/HTTPS URL' }

    const response = await fetch(directUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`)

    const blob = await response.blob()
    const contentType = (response.headers.get('content-type') || '').split(';')[0].toLowerCase()
    const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
    if (!allowedImageTypes.has(contentType)) {
      throw new Error(`The image link returned ${contentType || 'an unknown content type'}, not an image`)
    }
    const extension = contentType.split('/')[1] || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`

    const filePath = `${folder}/${fileName}`
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType,
      })

    if (uploadError) throw new Error(uploadError.message)

    const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(filePath)
    return { url: publicUrl.publicUrl, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown image upload error'
    console.error(`Error uploading image from ${url}:`, error)
    return { url: null, error: message }
  }
}

function getCellValue(row: any, keys: string[]): string {
  const normalizeKey = (key: string) => key.trim().replace(/\s+/g, ' ').toLowerCase()
  const normalizedKeys = new Set(keys.map(normalizeKey))
  for (const key of Object.keys(row)) {
    if (normalizedKeys.has(normalizeKey(key))) {
      const val = row[key]
      return val != null ? String(val) : ''
    }
  }
  return ''
}

function parseExcelRow(row: any, index: number): any {
  const parsed = {
    name: getCellValue(row, ['Name', 'name', 'Student Name', 'student_name', ' FULL NAME ', 'Full Name', 'full_name']),
    school: getCellValue(row, ['School', 'school', 'Institution', 'institution', 'college', 'College']) || 'Lionhill Vocational Centre',
    need: getCellValue(row, ['Need', 'need', 'Funding Need', 'funding_need', 'Amount', 'amount', 'Fees', 'fees']) || 'KSh 5,000',
    paybill: getCellValue(row, ['Paybill', 'paybill', 'Pay Bill', 'pay_bill']) || '600100',
    account: getCellValue(row, ['Account', 'account', 'Account Number', 'account_number', 'ADM. NUMBER', 'adm_number', ' ADM. Number']) || '',
    tag: getCellValue(row, ['Tag', 'tag', 'Study Area', 'study_area', 'Course', 'course', 'COURSE', 'course']) || '',
    course: getCellValue(row, ['Course', 'course', 'COURSE']) || '',
    number: getCellValue(row, ['Number', 'number', 'Student Number', 'student_number', 'ADM. NUMBER', 'adm_number', 'Adm. Number', 'Adm_Number']) || '',
    gender: getCellValue(row, ['Gender', 'gender', 'GENDER']) || '',
    phone: getCellValue(row, ['Phone Number', 'phone_number', 'Phone', 'phone', 'PHONE NUMBER']) || '',
    short: getCellValue(row, ['Short', 'short', 'Short Description', 'short_description', 'Bio', 'bio', 'Description']) || '',
    bio: getCellValue(row, ['Bio', 'bio', 'Description', 'description']) || '',
    image: getCellValue(row, ['Image', 'image', 'Photo', 'photo', 'STUDENT PHOTO', 'STUDENT  PHOTO', 'Student Photo', 'student_photo', 'Image URL', 'image_url', 'Photo URL', 'photo_url', 'PHOTO URL']),
    poster: getCellValue(row, ['Poster', 'poster', 'Poster Image', 'poster_image', 'Poster URL', 'poster_url']) || '',
    sponsored: getCellValue(row, ['Sponsored', 'sponsored']) === 'true' || getCellValue(row, ['Sponsored', 'sponsored']) === '1',
    sponsoredBy: getCellValue(row, ['Sponsored By', 'sponsored_by', 'Sponsor', 'sponsor']) || '',
    sponsoredDate: getCellValue(row, ['Sponsored Date', 'sponsored_date', 'Date Sponsored', 'date_sponsored']) || '',
    sponsoredQuote: getCellValue(row, ['Sponsored Quote', 'sponsored_quote', 'Quote', 'quote']) || '',
    published: getCellValue(row, ['Published', 'published']) !== 'false',
    sort_order: parseInt(getCellValue(row, ['Sort Order', 'sort_order', 'Order', 'order']) || '0') || 0,
  }

  // Trim all string fields
  for (const key of Object.keys(parsed)) {
    if (typeof (parsed as any)[key] === 'string') {
      (parsed as any)[key] = (parsed as any)[key].trim()
    }
  }

  // Auto-generate short (brief description) if not provided
  if (!parsed.short) {
    if (parsed.tag) {
      parsed.short = `${parsed.name} is a ${parsed.gender ? parsed.gender.toLowerCase() + ' ' : ''}student studying ${parsed.tag} at ${parsed.school}.`
    } else if (parsed.course) {
      parsed.short = `${parsed.name} is a ${parsed.gender ? parsed.gender.toLowerCase() + ' ' : ''}student at ${parsed.school}.`
    } else {
      parsed.short = `${parsed.name} is a student at ${parsed.school}.`
    }
  }

  // Auto-generate bio paragraphs if not provided
  if (!parsed.bio) {
    const bioParts = []
    if (parsed.gender) {
      bioParts.push(`Gender: ${parsed.gender}`)
    }
    if (parsed.tag) {
      bioParts.push(`Course: ${parsed.tag}`)
    }
    if (parsed.school) {
      bioParts.push(`School: ${parsed.school}`)
    }
    if (parsed.number) {
      bioParts.push(`Admission Number: ${parsed.number}`)
    }
    if (parsed.phone) {
      bioParts.push(`Phone: ${parsed.phone}`)
    }
    parsed.bio = bioParts.join('\n')
  }

  // Excel may expose a display label, a URL, or a URL followed by punctuation.
  parsed.image = extractUrl(parsed.image)
  parsed.poster = extractUrl(parsed.poster)

  if (parsed.image && parsed.image.includes('(')) {
    const urlMatch = parsed.image.match(/(https?:\/\/[^\s(]+)/)
    if (urlMatch) {
      parsed.image = urlMatch[1]
    }
  }

  // Clean up the number/account field - use ADM number
  if (!parsed.number && !parsed.account) {
    const adm = getCellValue(row, ['ADM. NUMBER', 'Adm Number', 'adm_number', ' ADM. NUMBER'])
    parsed.number = adm || String(index + 1)
    parsed.account = adm || String(index + 1)
  }

  return parsed
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
    const workbook = XLSX.read(buffer, { type: 'buffer', cellStyles: true })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = addExcelHyperlinks(XLSX.utils.sheet_to_json(worksheet), worksheet)

    if (!jsonData || jsonData.length === 0) {
      return NextResponse.json({ error: 'Excel file is empty or has no data rows' }, { status: 400 })
    }

    const results = []
    const errors = []
    const imageErrors: Array<{ row: number; field: 'image' | 'poster'; source: string; error: string }> = []

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
          if (imageUrl) {
            if (!/^https?:\/\//i.test(imageUrl)) {
              imageErrors.push({ row: i + 2, field: 'image', source: imageUrl, error: 'Image value is not an HTTP/HTTPS URL' })
            } else {
              const sourceUrl = imageUrl
              const uploaded = await downloadAndUploadImage(sourceUrl, 'students', supabase)
              if (uploaded.url) imageUrl = uploaded.url
              else if (uploaded.error) imageErrors.push({ row: i + 2, field: 'image', source: sourceUrl, error: uploaded.error })
            }
          }
          if (posterUrl) {
            if (!/^https?:\/\//i.test(posterUrl)) {
              imageErrors.push({ row: i + 2, field: 'poster', source: posterUrl, error: 'Poster value is not an HTTP/HTTPS URL' })
            } else {
              const sourceUrl = posterUrl
              const uploaded = await downloadAndUploadImage(sourceUrl, 'students', supabase)
              if (uploaded.url) posterUrl = uploaded.url
              else if (uploaded.error) imageErrors.push({ row: i + 2, field: 'poster', source: sourceUrl, error: uploaded.error })
            }
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
      imageErrors,
    }, { status: errors.length > 0 && results.length === 0 ? 400 : 200 })

  } catch (error) {
    console.error('Error bulk importing students:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}