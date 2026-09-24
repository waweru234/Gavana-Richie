import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function generateSlug(name: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  return `${cleanName}-${randomSuffix}`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Missing student ID' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient()
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing student ID' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    const allowedFields = [
      'name', 'school', 'need', 'paybill', 'account', 'image', 'poster',
      'tag', 'number', 'short', 'bio', 'sponsored', 'sponsored_by',
      'sponsored_date', 'sponsored_quote', 'published', 'sort_order', 'slug'
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] === 'string') {
          updateData[field] = body[field].trim() || null
        } else if (Array.isArray(body[field])) {
          updateData[field] = body[field].filter(Boolean).map((t: string) => t.trim())
        } else {
          updateData[field] = body[field]
        }
      }
    }

    if (body.name && !body.slug) {
      updateData.slug = generateSlug(body.name)
    }

    const { data, error } = await supabase
      .from('students')
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Missing student ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}