import { createServerClient } from '@/lib/supabase'

export interface StudentProfile {
  id: string
  slug: string
  name: string
  school: string
  need: string
  paybill: string
  account: string
  image: string | null
  poster: string | null
  tag: string
  number: string
  short: string | null
  bio: string[] | null
  sponsored: boolean
  sponsoredBy: string | null
  sponsoredDate: string | null
  sponsoredQuote: string | null
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface StudentFormData {
  name: string
  school: string
  need: string
  paybill: string
  account: string
  image: string
  poster: string
  tag: string
  number: string
  short: string
  bio: string[]
  sponsored: boolean
  sponsoredBy: string
  sponsoredDate: string
  sponsoredQuote: string
  published: boolean
}

function generateSlug(name: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  return `${cleanName}-${randomSuffix}`
}

export async function getPublishedStudents(): Promise<StudentProfile[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return []
    }

    return (data || []).map(s => mapStudent(s))
  } catch (error) {
    console.error('Error fetching students:', error)
    return []
  }
}

export async function getStudentBySlug(slug: string): Promise<StudentProfile | null> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') console.error('Supabase error:', error)
      return null
    }

    return data ? mapStudent(data) : null
  } catch (error) {
    console.error('Error fetching student:', error)
    return null
  }
}

export async function getAllStudentsAdmin(offset = 0, limit = 50): Promise<{ data: StudentProfile[]; count: number }> {
  try {
    const supabase = createServerClient()
    const { data, error, count } = await supabase
      .from('students')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase error:', error)
      return { data: [], count: 0 }
    }

    return { data: (data || []).map(s => mapStudent(s)), count: count || 0 }
  } catch (error) {
    console.error('Error fetching all students:', error)
    return { data: [], count: 0 }
  }
}

function mapStudent(row: any): StudentProfile {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    school: row.school,
    need: row.need,
    paybill: row.paybill,
    account: row.account,
    image: row.image,
    poster: row.poster,
    tag: row.tag,
    number: row.number,
    short: row.short,
    bio: row.bio,
    sponsored: row.sponsored,
    sponsoredBy: row.sponsored_by,
    sponsoredDate: row.sponsored_date,
    sponsoredQuote: row.sponsored_quote,
    published: row.published,
    sort_order: row.sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}