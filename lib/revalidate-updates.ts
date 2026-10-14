import { revalidatePath } from 'next/cache'

// Refresh every public page that lists or shows updates after an admin change
export function revalidateUpdatePages() {
  revalidatePath('/')
  revalidatePath('/updates')
  revalidatePath('/updates/[slug]', 'page')
  revalidatePath('/sitemap.xml')
}
