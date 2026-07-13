import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { returning, writeOn } from '../../lib/visit'
import { HERO } from '../../motion/tokens'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import { registerTimeline } from '../../motion/registry'
import '../../motion/eases'
import './hero.css'

gsap.registerPlugin(DrawSVGPlugin)

/* The ink system: on a first visit the handwritten line soaks in left-to-right
   (soft feathered mask edge — ink into paper, not a wipe). On every load the
   underline draws itself ~1.2s in, with a stroke-width swell for nib pressure. */

export function Hero() {
  const scriptRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

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
    // Draw and weight settle in lockstep on the same ease: the ink reaches full
    // thickness exactly as the pen finishes, monotonically — no thicken-then-thin pulse.
    tl.to(path, { drawSVG: '100%', duration: HERO.drawDur, ease: 'inkDraw' }, HERO.drawDelay).to(
      path,
      { strokeWidth: HERO.strokeSwell.to, duration: HERO.drawDur, ease: 'inkDraw' },
      HERO.drawDelay,
    )

    registerTimeline('hero-ink', tl)
  })

  return (
    <>
      <div className="hero">
        {/* Both greetings must fit the display line at 52px — the earlier
            "Welcome back — it's Vikas, and" wrapped into a broken two-liner.
            A returning visitor knows whose room this is; drop the name. */}
        <div className="hero-greet">{returning ? 'Welcome back, and' : "Hello, I'm Vikas and"}</div>
        <div ref={scriptRef} className={`hero-script${writeOn ? ' ink-mask' : ''}`}>
          I&#39;m glad{' '}
          <span className="hero-ul">
            you are here!
            <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
              <path ref={pathRef} className="hero-path" d="M4 9 C 52 3, 92 12, 140 6 C 166 3, 186 8, 197 6" />
            </svg>
          </span>
        </div>
      </div>
      <p className="hero-body">
        I design products that help people focus on their work, not their tools. For the last decade, I&#39;ve helped teams
        turn fuzzy ideas into things people genuinely enjoy using — AI tools, learning platforms, and the enterprise
        software people spend their days in.
      </p>
    </>
  )
}
