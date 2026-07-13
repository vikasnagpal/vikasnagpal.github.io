import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { AtmospherePill } from '../features/atmosphere/AtmospherePill'
import { Hero } from '../features/hero/Hero'
import { NavTrio } from '../features/nav/NavTrio'
import { PSBlock } from '../features/contact/PSBlock'
import { Guestbook } from '../features/guestbook/Guestbook'
import { introReveal } from '../motion/choreographies/intro'
import { prefersReducedMotion } from '../motion/reducedMotion'
import { registerTimeline } from '../motion/registry'

/* The desk itself — extracted verbatim from the original App composition.
   CONSTRAINTS: introReveal staggers `.site-left > *`, so those four blocks must
   stay direct children; `.site-grid` keeps its content-box quirk and is used by
   this page only. */

// The arrival plays once per visit. Coming back from an inner page re-enters a
// room you're already in — no replay. (Cleared again if the timeline barely
// started, which also keeps StrictMode's dev double-mount playing it.)
let arrived = false

export default function Home() {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (arrived || prefersReducedMotion() || !gridRef.current) return
      arrived = true
      const tl = introReveal(gridRef.current)
      registerTimeline('intro', tl)
      return () => {
        if (tl.progress() < 0.5) arrived = false
      }
    },
    { scope: gridRef },
  )

  return (
    <div className="site-grid" data-two-col ref={gridRef}>
      <div className="site-left">
        <AtmospherePill />
        <Hero />
        <NavTrio />
        <PSBlock />
      </div>
      <Guestbook />
    </div>
  )
}
