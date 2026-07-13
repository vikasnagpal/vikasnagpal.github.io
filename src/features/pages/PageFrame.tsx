import { useEffect, useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'wouter'
import { usePageMeta } from '../../lib/usePageMeta'
import { pageEnter } from '../../motion/choreographies/pageEnter'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import { registerTimeline } from '../../motion/registry'
import './pageframe.css'

/* The shared inner-page sheet: a reading-width column with a way back to the
   desk. Direct children of PageFrame are the entrance stagger units — keep
   each content block a direct child (same contract as .site-left > *). */

interface PageFrameProps {
  title: string
  description?: string
  children: ReactNode
}

export function PageFrame({ title, description, children }: PageFrameProps) {
  usePageMeta(title, description)
  const ref = useRef<HTMLDivElement>(null)

  // Route changes land at the top of the new page, always.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      registerTimeline('page', pageEnter(ref.current))
    },
    { scope: ref },
  )

  return (
    <div className="pf" ref={ref}>
      <Link href="/" className="pf-back">
        ← back to the desk
      </Link>
      {children}
    </div>
  )
}
