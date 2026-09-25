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

async function downloadAndUploadImage(url: string, folder: string, supabase: any): Promise<string | null> {
  if (!url || !url.trim() || !url.startsWith('http')) return null
  
  try {
    const response = await fetch(url.trim())
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`)
    
    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const extension = contentType.split('/')[1] || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`
    
    const formData = new FormData()
    formData.append('file', blob, fileName)
    formData.append('folder', folder)
    
    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/upload`, {
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

function parseExcelRow(row: any, index: number): any {
  return {
    name: row['Name'] || row['name'] || row['Student Name'] || row['student_name'] || '',
    school: row['School'] || row['school'] || row['Institution'] || row['institution'] || '',
    need: row['Need'] || row['need'] || row['Funding Need'] || row['funding_need'] || '',
    paybill: row['Paybill'] || row['paybill'] || row['Pay Bill'] || row['pay_bill'] || '',
    account: row['Account'] || row['account'] || row['Account Number'] || row['account_number'] || '',
    tag: row['Tag'] || row['tag'] || row['Study Area'] || row['study_area'] || row['Course'] || row['course'] || '',
    number: row['Number'] || row['number'] || row['Student Number'] || row['student_number'] || String(index + 1),
    short: row['Short'] || row['short'] || row['Short Description'] || row['short_description'] || '',
    bio: row['Bio'] || row['bio'] || row['Description'] || row['description'] || '',
    image: row['Image'] || row['image'] || row['Photo'] || row['photo'] || row['Image URL'] || row['image_url'] || '',
    poster: row['Poster'] || row['poster'] || row['Poster Image'] || row['poster_image'] || row['Poster URL'] || row['poster_url'] || '',
    sponsored: row['Sponsored'] === 'true' || row['Sponsored'] === true || row['sponsored'] === 'true' || row['sponsored'] === true,
    sponsoredBy: row['Sponsored By'] || row['sponsored_by'] || row['Sponsor'] || row['sponsor'] || '',
    sponsoredDate: row['Sponsored Date'] || row['sponsored_date'] || row['Date Sponsored'] || row['date_sponsored'] || '',
    sponsoredQuote: row['Sponsored Quote'] || row['sponsored_quote'] || row['Quote'] || row['quote'] || '',
    published: row['Published'] !== 'false' && row['Published'] !== false && row['published'] !== 'false' && row['published'] !== false,
    sort_order: parseInt(row['Sort Order'] || row['sort_order'] || row['Order'] || row['order'] || '0') || 0,
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const formData = await request.formData()
    const file = formData.get('file') as File
    const autoUploadImages = formData.get('autoUploadImages') === 'true'
    
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
        
        const requiredFields = ['name', 'school', 'need', 'paybill', 'account', 'tag', 'number']
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
            poster: posterUrl,
            tag: parsed.tag.trim(),
            number: parsed.number.trim(),
            short: parsed.short?.trim() || null,
            bio: bioArray,
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