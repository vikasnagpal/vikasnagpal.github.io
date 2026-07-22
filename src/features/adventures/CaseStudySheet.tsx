import { useEffect, useRef, useState, type UIEvent, type TouchEvent, type WheelEvent } from 'react'
import type { CaseStudy } from './caseStudies'
import { CloseX } from './icons'
import './casestudysheet.css'

/* A bottom sheet deep-linked off the URL hash (#cs/<slug>) rather than local
   state some trigger button owns — the listing card is then just a plain
   <a href="#cs/...">, and this component is the only thing that needs to know
   how the sheet opens, docks, and closes. Ported from the design's scroll/
   swipe/wheel "pull" gesture: undock once, pull again to close. */

const CLOSE_MS = 190
const PULL_COOLDOWN_MS = 600
const TOUCH_PULL_PX = 70
const DOCK_SCROLL_PX = 48

function hashSlug(): string | null {
  const h = window.location.hash
  return h.startsWith('#cs/') ? h.slice(4) : null
}

export function CaseStudySheet({ study }: { study: CaseStudy }) {
  const [open, setOpen] = useState(() => hashSlug() === study.slug)
  const [docked, setDocked] = useState(false)
  const [closing, setClosing] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const cooldownAt = useRef(0)
  const touchY = useRef(0)

  useEffect(() => {
    const sync = () => {
      const want = hashSlug() === study.slug
      setOpen((prev) => {
        if (want === prev) return prev
        document.body.style.overflow = want ? 'hidden' : ''
        if (want) setDocked(false)
        return want
      })
    }
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [study.slug])

  const close = () => {
    if (closeTimer.current) return
    setClosing(true)
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null
      if (hashSlug() === study.slug) {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
      setClosing(false)
      setOpen(false)
      document.body.style.overflow = ''
    }, CLOSE_MS)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // close() is stable enough for this: re-binding on every render would be
    // harmless too, but the slug is the only thing that should reset this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
      document.body.style.overflow = ''
    }
  }, [])

  const pull = () => {
    const now = Date.now()
    if (cooldownAt.current && now - cooldownAt.current < PULL_COOLDOWN_MS) return
    cooldownAt.current = now
    if (docked) setDocked(false)
    else close()
  }

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    if (!docked && e.currentTarget.scrollTop > DOCK_SCROLL_PX) {
      cooldownAt.current = Date.now()
      setDocked(true)
    }
  }
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 0 || e.deltaY > -8) return
    pull()
  }
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchY.current = e.touches[0].clientY
  }
  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 0) return
    const dy = e.touches[0].clientY - touchY.current
    if (dy > TOUCH_PULL_PX) {
      touchY.current = e.touches[0].clientY
      pull()
    }
  }

  if (!open) return null

  return (
    <>
      <div className="css-dim" data-closing={closing || undefined} onClick={close} />
      <div
        className="css-sheet"
        data-closing={closing || undefined}
        data-docked={docked || undefined}
        role="dialog"
        aria-modal="true"
        aria-label={study.title}
      >
        {docked ? (
          <div className="css-bar">
            <div className="css-bar-text">
              <span className="css-eyebrow">{study.org}</span>
              <span className="css-bar-title">{study.title}</span>
            </div>
            <button className="css-close" onClick={close} aria-label="Close case study">
              <CloseX />
            </button>
          </div>
        ) : (
          <div className="css-grab">
            <div className="css-handle" />
            <div className="css-hint">keep scrolling to read the whole story</div>
          </div>
        )}
        <div
          className="css-body"
          onScroll={onScroll}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          <div className="css-content">
            <div className="css-eyebrow">
              {study.org} &middot; CASE STUDY
            </div>
            <h2 className="css-title">{study.title}</h2>
            <div className="css-dek">{study.dek}</div>
            <div className="css-meta">
              {study.role} &middot; {study.year} &middot; {study.readTime}
            </div>
            <img className="css-hero-img" src={study.cover} alt="" />
            <study.Body />
          </div>
        </div>
      </div>
    </>
  )
}
