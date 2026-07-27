import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { CoinSVG } from '../nav/CoinSVG'
import { wavesIcon } from '../nav/navIcons'
import { coinArc } from '../../motion/choreographies/coin'
import { floatBurst } from '../../motion/choreographies/floats'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import { registerTimeline } from '../../motion/registry'
import { useAtmosphere } from '../atmosphere/atmosphere'
import { chime } from '../../lib/audio'
import { COIN, DISCOVERY } from '../../motion/tokens'

/* The coin, catchable inside its own case study.

   Deliberately NOT the nav's coin: the real one is a secret you have to earn by
   fidgeting, and it keeps a ledger. Here the secret is already blown by the
   paragraph above it, so the gesture is forgiving (wiggle, rub, or just tap)
   and nothing is recorded — catching one in the article must never inflate the
   count that rewrites the P.S. downstairs. Same arc, same coin, same chime;
   only the bookkeeping is left out. */

export function CoinBump() {
  const iconRef = useRef<HTMLSpanElement>(null)
  const coinRef = useRef<HTMLSpanElement>(null)
  const noteRef = useRef<HTMLSpanElement>(null)
  const [spawn, setSpawn] = useState(0)
  const [note, setNote] = useState(false)
  const caught = useRef(false)
  const flying = useRef(false)
  const { night } = useAtmosphere()

  const fire = () => {
    if (flying.current) return
    flying.current = true
    chime({ night })
    setSpawn((n) => n + 1)
  }

  /* Desktop: the same reversal-gated wiggle the nav uses — a straight pass
     through is one direction and can never fire. Touch: a horizontal rub. */
  const stroke = useRef<{ x: number; dir: number; travel: number; fired: boolean; reversed: boolean } | null>(null)
  const track = (x: number, needReversal: boolean, threshold: number) => {
    const s = stroke.current
    if (!s) {
      stroke.current = { x, dir: 0, travel: 0, fired: false, reversed: false }
      return
    }
    const dx = x - s.x
    s.x = x
    if (dx === 0) return
    const dir = dx > 0 ? 1 : -1
    if (dir !== s.dir) {
      if (s.dir !== 0) s.reversed = true
      s.dir = dir
      s.travel = 0
      s.fired = false
    }
    s.travel += Math.abs(dx)
    if ((s.reversed || !needReversal) && !s.fired && s.travel >= threshold) {
      s.fired = true
      fire()
    }
  }
  const release = () => {
    stroke.current = null
  }

  useGSAP(
    () => {
      if (!spawn || !coinRef.current) return
      const tl = coinArc(coinRef.current, iconRef.current, {
        reduced: prefersReducedMotion(),
        onComplete: () => {
          flying.current = false
          // "Nice catch." belongs to the first one only — after that it's just a coin
          if (!caught.current) {
            caught.current = true
            setNote(true)
          }
        },
      })
      registerTimeline('cs-coin', tl)
    },
    { dependencies: [spawn] },
  )

  useGSAP(
    () => {
      if (note && noteRef.current) floatBurst(noteRef.current)
    },
    { dependencies: [note] },
  )

  return (
    <div className="cs-bump">
      <button
        type="button"
        className="cs-bump-hit"
        aria-label="Bump the icon to flip a coin out of it"
        onClick={fire}
        onMouseMove={(e) => track(e.clientX, true, DISCOVERY.wiggleStrokePx)}
        onMouseLeave={release}
        onTouchStart={(e) => {
          stroke.current = { x: e.touches[0].clientX, dir: 0, travel: 0, fired: false, reversed: false }
        }}
        onTouchMove={(e) => track(e.touches[0].clientX, false, COIN.rubStrokePx)}
        onTouchEnd={release}
        onTouchCancel={release}
      >
        {spawn > 0 && (
          <span className="cs-bump-coin" ref={coinRef} aria-hidden>
            <CoinSVG variant="gold" night={night} />
          </span>
        )}
        {note && (
          <span className="cs-bump-note" ref={noteRef} aria-hidden>
            Nice catch.
          </span>
        )}
        <span className="cs-bump-icon" ref={iconRef}>
          {wavesIcon}
        </span>
      </button>
      {/* the prompt retires itself once you've had one — `note` flips at the
          same moment `caught` does, and it's the one that re-renders */}
      <span className="cs-bump-cap">{note ? 'again, if you like.' : 'go on, bump it.'}</span>
    </div>
  )
}
