import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

export async function POST(request: Request) {
  try {
    const { full_name, email, phone_number, message } = await request.json();

    // Basic validation
    if (!full_name || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('join_requests')
      .insert<Database['public']['Tables']['join_requests']['Insert']>([
        {
          full_name,
          email,
          phone_number: phone_number || null,
          message: message || null,
        }
      ])
      .select<Database['public']['Tables']['join_requests']['Row']>();

    if (error) {
      console.error('Error inserting join request:', error);
      return NextResponse.json(
        { error: 'Failed to submit join request' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Join request submitted successfully', data },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error in join request API:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}