import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'wouter'
import { AtmosphereLamp } from '../atmosphere/AtmosphereLamp'
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

  // (Scroll reset lives in App's ScrollReset — every route change lands at the top.)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      registerTimeline('page', pageEnter(ref.current))
    },
    { scope: ref },
  )

  return (
    <div className="pf" ref={ref}>
      <div className="pf-top">
        {/* Hand-drawn arrow, not the "←" glyph: Nunito's subset lacks U+2190, so
            phones substitute a system font — misaligned and off-voice (seen on
            Android). Drawn strokes render identically everywhere. */}
        <Link href="/" className="pf-back">
          <svg width="19" height="13" viewBox="0 0 24 15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M22 7.8 C 15 6.6, 9.5 7, 3 7.6" />
            <path d="M8.5 3.2 L2.6 7.6 L9 11.8" />
          </svg>
          <span>back to the desk</span>
        </Link>
        <AtmosphereLamp />
      </div>
      {children}
    </div>
  )
}
