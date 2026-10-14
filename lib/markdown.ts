// Minimal Markdown → HTML for update content written in the admin editor.
// Supports headings, paragraphs, line breaks, blockquotes, bullet/numbered lists,
// **bold**, *italic* and [links](url). Content that is already HTML is passed through.

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const safeUrl = (url: string) => (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(url) ? url : '#')

function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
      const href = safeUrl(url.replace(/&amp;/g, '&'))
      const external = /^https?:\/\//i.test(href)
      return `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
}

export function looksLikeHtml(content: string) {
  return /^\s*<(p|div|h[1-6]|ul|ol|blockquote|section|article|figure|img|br)\b/i.test(content)
}

export function renderMarkdown(content: string): string {
  if (!content) return ''
  if (looksLikeHtml(content)) return content

  const blocks = content.replace(/\r\n/g, '\n').trim().split(/\n\s*\n/)
  return blocks
    .map(block => {
      const lines = block.split('\n')

      const heading = block.match(/^(#{1,4})\s+(.+)$/)
      if (heading && lines.length === 1) {
        const level = Math.min(heading[1].length + 1, 4) // # → h2, the page title is the h1
        return `<h${level}>${inline(heading[2])}</h${level}>`
      }

      if (lines.every(l => /^\s*>/.test(l))) {
        const inner = lines.map(l => inline(l.replace(/^\s*>\s?/, ''))).join('<br/>')
        return `<blockquote><p>${inner}</p></blockquote>`
      }

      if (lines.every(l => /^\s*[-*•]\s+/.test(l))) {
        return `<ul>${lines.map(l => `<li>${inline(l.replace(/^\s*[-*•]\s+/, ''))}</li>`).join('')}</ul>`
      }

      if (lines.every(l => /^\s*\d+[.)]\s+/.test(l))) {
        return `<ol>${lines.map(l => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`
      }

      return `<p>${lines.map(inline).join('<br/>')}</p>`
    })
    .join('\n')
}

// Plain-text version, used for card previews
export function stripToText(content: string): string {
  return content
    .replace(/<[^>]*>/g, ' ')
    .replace(/^\s*(#{1,4}|>|[-*•]|\d+[.)])\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}
