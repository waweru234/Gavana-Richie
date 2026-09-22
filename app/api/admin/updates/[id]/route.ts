import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { UpdatePost, CreateUpdatePostData } from '@/lib/update-types'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching update:', error)
    return NextResponse.json({ error: 'Failed to fetch update' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient()
    const { id } = await params
    const body: Partial<CreateUpdatePostData> = await request.json()

    const updateData = {
      ...body,
      slug: body.title ? generateSlug(body.title) : undefined,
      updated_at: new Date().toISOString(),
      published_at: body.published ? new Date().toISOString() : undefined,
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData]
      }
    })

    const { data, error } = await supabase
      .from('updates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating update:', error)
    return NextResponse.json({ error: 'Failed to update update' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient()
    const { id } = await params

    const { error } = await supabase
      .from('updates')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting update:', error)
    return NextResponse.json({ error: 'Failed to delete update' }, { status: 500 })
  }
}