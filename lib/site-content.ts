import { getSupabaseServerClient } from '@/lib/supabase'
import type { Json } from '@/types/supabase'

type Plain = Record<string, unknown>

const isPlainObject = (v: unknown): v is Plain =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

// Overlay saved values onto defaults so new fields always have a value and
// a partially saved document never blanks out the page.
export function mergeWithDefaults<T>(defaults: T, saved: unknown): T {
  if (saved === undefined || saved === null) return defaults
  if (Array.isArray(defaults)) {
    if (!Array.isArray(saved)) return defaults
    // Arrays of objects merge by index; arrays of primitives are replaced wholesale
    if (defaults.length && isPlainObject(defaults[0])) {
      return defaults.map((item, i) => mergeWithDefaults(item, saved[i])) as T
    }
    return saved as T
  }
  if (isPlainObject(defaults)) {
    if (!isPlainObject(saved)) return defaults
    const out: Plain = { ...defaults }
    for (const key of Object.keys(defaults)) {
      out[key] = mergeWithDefaults((defaults as Plain)[key], saved[key])
    }
    return out as T
  }
  return typeof saved === typeof defaults ? (saved as T) : defaults
}

export async function getContent<T>(key: string, defaults: T): Promise<T> {
  const supabase = getSupabaseServerClient()
  if (!supabase) return defaults
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', key)
      .maybeSingle()
    if (error || !data) return defaults
    return mergeWithDefaults(defaults, data.value)
  } catch {
    return defaults
  }
}

export async function saveContent(key: string, value: unknown) {
  const supabase = getSupabaseServerClient()
  if (!supabase) throw new Error('Database is not configured')
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value: value as Json, updated_at: new Date().toISOString() })
  if (error) throw new Error(error.message)
}
