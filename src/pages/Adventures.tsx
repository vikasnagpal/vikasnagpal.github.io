import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { PageFrame } from '../features/pages/PageFrame'
import { CaseStudySheet } from '../features/adventures/CaseStudySheet'
import { ArrowNE, ArrowRight } from '../features/adventures/icons'
import { ORGS, SHOW_CASE_STUDIES } from '../features/adventures/data'
import { CASE_STUDIES } from '../features/adventures/caseStudies'
import { useIsMobile } from '../features/adventures/useIsMobile'
import { ADVENTURES as ADVENTURES_META } from '../lib/routeMeta'
import { writeOn } from '../lib/visit'
import { HERO } from '../motion/tokens'
import { prefersReducedMotion } from '../motion/reducedMotion'
import { registerTimeline } from '../motion/registry'
import '../motion/eases'
import './adventures.css'

gsap.registerPlugin(DrawSVGPlugin)

/* Every stop plus the case-studies section make up the scroll-spy list and the
   rail/jump-bar entries — one source so they can't drift apart. Case studies
   joins only while there's something to show (SHOW_CASE_STUDIES). */
const NAV_ITEMS: { id: string; label: string }[] = [
  ...ORGS.map((o) => ({ id: o.id, label: o.shortName })),
  ...(SHOW_CASE_STUDIES ? [{ id: 'adv-casestudies', label: 'Case studies' }] : []),
]
const SECTION_IDS = NAV_ITEMS.map((n) => n.id)

/* A section "arrives" once its top has scrolled past this line — matches the
   sticky mobile jump bar's height with a little breathing room. */
const SPY_LINE_PX = 170

function useActiveSection(ids: string[]): [string, (id: string) => void] {
  const [active, setActive] = useState(ids[0])
  /* A rail/jump-bar click locks the highlight to the chosen section so the
     scroll-spy can't override it — the last two sections can be too short to
     ever reach the reading line, so a click that scrolls to the bottom would
     otherwise snap the highlight to whatever's actually pinned there. The lock
     lifts the moment the visitor scrolls under their own power. */
  const lockedRef = useRef(false)
  useEffect(() => {
    let ticking = false
    const compute = () => {
      if (lockedRef.current) return
      const scrollY = window.scrollY
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      /* Each section's "activation scroll" = the scroll position at which its
         top reaches the detection line. This is the plain reading-position rule
         (the section at the top of the reading area is active), so jumping to a
         section lands exactly on it. */
      const acts = ids.map((id) => {
        const el = document.getElementById(id)
        if (!el) return Infinity
        return el.getBoundingClientRect().top + scrollY - SPY_LINE_PX
      })
      /* The only wrinkle: short trailing sections on a tall viewport can't push
         their top up to the line before the page runs out of scroll, so they'd
         never highlight. Spread ONLY those past-the-end sections across the
         remaining scroll (last one winning at the very bottom). Reachable
         sections are left untouched, so this never pulls a later section's
         highlight up over the one you actually scrolled or jumped to. */
      let k = acts.length
      for (let i = 0; i < acts.length; i++) {
        if (acts[i] > maxScroll) {
          k = i
          break
        }
      }
      if (k < acts.length) {
        const base = k > 0 ? Math.min(acts[k - 1], maxScroll) : 0
        const span = maxScroll - base
        const n = acts.length - k
        for (let j = k; j < acts.length; j++) acts[j] = base + (span * (j - k + 1)) / n
      }
      let current = ids[0]
      for (let i = 0; i < ids.length; i++) {
        if (scrollY >= acts[i] - 1) current = ids[i]
      }
      setActive((prev) => (prev === current ? prev : current))
    }
    compute()
    let raf = 0
    const onScroll = () => {
      if (ticking) return
      ticking = true
      raf = requestAnimationFrame(() => {
        ticking = false
        compute()
      })
    }
    // The visitor taking over the scroll (wheel / touch / keyboard) hands
    // control back to the spy. Programmatic smooth-scroll fires 'scroll' but
    // never these, so a click's lock survives its own animation.
    const unlock = () => {
      lockedRef.current = false
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('wheel', unlock, { passive: true })
    window.addEventListener('touchmove', unlock, { passive: true })
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', unlock)
      window.removeEventListener('touchmove', unlock)
      window.removeEventListener('keydown', unlock)
      cancelAnimationFrame(raf)
    }
  }, [ids])
  const lockTo = useCallback((id: string) => {
    lockedRef.current = true
    setActive(id)
  }, [])
  return [active, lockTo]
}

function jumpTo(id: string, isMobile: boolean) {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - (isMobile ? 78 : 28)
  window.scrollTo({ top: Math.max(0, y), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

export default function Adventures() {
  /* The reading column is centered on the viewport with the index rail floated
     into the left margin (see .adv-grid). That margin only fits the rail above
     ~1240px; below it the rail becomes the sticky jump bar. This breakpoint
     must match the 1240px media query in adventures.css. */
  const isMobile = useIsMobile(1240)
  const [active, lockTo] = useActiveSection(SECTION_IDS)
  const scriptRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  /* Same ink system as the home Hero: the underline draws itself in on every
     visit, the script line's own ink-soak reveal only on a true first visit
     (writeOn, shared site-wide — see lib/visit.ts). */
  useGSAP(() => {
    const script = scriptRef.current
    const path = pathRef.current
    if (!script || !path) return

    if (prefersReducedMotion()) {
      script.classList.remove('ink-mask')
      gsap.set(path, { visibility: 'visible', drawSVG: '100%', strokeWidth: HERO.strokeSwell.to })
      return
    }

    const tl = gsap.timeline()
    if (writeOn) {
      tl.fromTo(
        script,
        { '--inkx': '100%' },
        {
          '--inkx': '0%',
          duration: HERO.inkDur,
          ease: 'inkFlow',
          onComplete: () => script.classList.remove('ink-mask'),
        },
        HERO.inkDelay,
      )
    }
    gsap.set(path, { visibility: 'visible', drawSVG: '0%', strokeWidth: HERO.strokeSwell.from })
    tl.to(path, { drawSVG: '100%', duration: HERO.drawDur, ease: 'inkDraw' }, HERO.drawDelay).to(
      path,
      { strokeWidth: HERO.strokeSwell.to, duration: HERO.drawDur, ease: 'inkDraw' },
      HERO.drawDelay,
    )
    registerTimeline('adv-ink', tl)
  })

  return (
    <>
      <PageFrame title={ADVENTURES_META.title} description={ADVENTURES_META.description} wide>
        <div className="adv-grid">
          {!isMobile && (
            <div className="adv-rail">
              <div className="adv-rail-label">ADVENTURES</div>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="adv-rail-link"
                  data-active={active === item.id || undefined}
                  onClick={() => {
                    lockTo(item.id)
                    jumpTo(item.id, isMobile)
                  }}
                >
                  &#8226;&nbsp;&nbsp;{item.label}
                </button>
              ))}
            </div>
          )}

          {/* The heading, index rail and body share one grid so the title sits
              directly above the content it introduces, with the rail anchored in
              the top-left corner rather than floating below (no empty quadrant). */}
          <div className="adv-main">
            <header className="adv-head">
              <h1 className="pf-title">Past adventures</h1>
              <div ref={scriptRef} className={`adv-script${writeOn ? ' ink-mask' : ''}`}>
                a field guide to{' '}
                <span className="adv-ul">
                  where I&#39;ve been
                  <svg className="adv-ul-svg" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                    <path ref={pathRef} className="adv-path" d="M5 8 C45 3 85 10 125 6 C160 3 185 7 196 5" />
                  </svg>
                </span>
              </div>
              <p className="adv-intro">
                Every place I&#39;ve worked taught me something different. The briefs below cover what I did at each
                stop, and the case study at the end is a closer look at one build: this very site.
              </p>
            </header>

            {isMobile && (
              <nav className="adv-jumpbar" aria-label="Jump to section">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="adv-pill"
                    data-active={active === item.id || undefined}
                    onClick={() => {
                    lockTo(item.id)
                    jumpTo(item.id, isMobile)
                  }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}

            <div className="adv-content">
              {ORGS.map((org) => (
                <section
                  key={org.id}
                  id={org.id}
                  className="adv-card"
                  data-linked={org.links?.length ? '' : undefined}
                >
                  <div className="adv-card-head">
                    <span className="adv-card-name">{org.name}</span>
                    <span className="adv-card-tagline">{org.tagline}</span>
                  </div>
                  <div className="adv-card-sub">
                    {org.role} &middot; {org.years}
                  </div>
                  <p className="adv-card-brief">{org.brief}</p>
                  {org.links && org.links.length > 0 && (
                    <div className="adv-visits">
                      {org.links.map((link) => (
                        <a
                          key={link.href}
                          className="adv-visit"
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          visit {link.label} <ArrowNE />
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              ))}

              {SHOW_CASE_STUDIES && (
                <section id="adv-casestudies" className="adv-section">
                  <div className="adv-section-head">
                    <span className="adv-section-title">Case studies</span>
                    <span className="adv-section-tag">deeper dives, one project at a time</span>
                  </div>
                  <div className="adv-cs-grid">
                    {CASE_STUDIES.map((cs) => (
                      <a key={cs.slug} className="adv-cs-card" href={`#cs/${cs.slug}`}>
                        <img className="adv-cs-cover" src={cs.cover} alt="" loading="lazy" />
                        <div className="adv-cs-body">
                          <div className="adv-eyebrow">{cs.org}</div>
                          <div className="adv-cs-title">{cs.title}</div>
                          <div className="adv-cs-dek">{cs.cardDek}</div>
                          <div className="adv-cs-read">
                            read the story <ArrowRight />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </PageFrame>

      {/* Rendered as PageFrame's sibling, not its child: pageEnter puts an
          inline transform on .pf's direct children during the entrance tween,
          and a transform on a position:fixed element makes it establish its
          own containing block instead of the viewport (a CSS spec quirk —
          the fixed sheet would render relative to .pf, not the screen). Keep
          it outside .pf so it stays viewport-fixed even if ever deep-linked
          open during that first ~0.6s. */}
      {SHOW_CASE_STUDIES && CASE_STUDIES.map((cs) => <CaseStudySheet key={cs.slug} study={cs} />)}
    </>
  )
}
