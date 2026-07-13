import { useEffect } from 'react'

/* Per-route title/description. The home values live in index.html; inner pages
   set their own on mount and hand the originals back on unmount. */

const HOME_TITLE = "Vikas — I'm glad you are here"

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? null
    if (description && meta) meta.setAttribute('content', description)
    return () => {
      document.title = HOME_TITLE
      if (meta && prev != null) meta.setAttribute('content', prev)
    }
  }, [title, description])
}
