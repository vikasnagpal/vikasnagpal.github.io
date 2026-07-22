import { useEffect, useState } from 'react'

/** Whether the viewport is at or below `maxWidthPx`, live-updated via
    matchMedia. Read synchronously on first render (no SSR here) so desktop
    and mobile never both flash before settling. */
export function useIsMobile(maxWidthPx: number): boolean {
  const query = `(max-width: ${maxWidthPx}px)`
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setIsMobile(mq.matches)
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)
    onChange()
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [query])

  return isMobile
}
