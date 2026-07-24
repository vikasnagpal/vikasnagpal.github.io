import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { STAMPS, type StampKey, type Thought } from '../../lib/seeds'
import { REACTION } from '../../motion/tokens'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import { registerTimeline } from '../../motion/registry'
import { floatBurst } from '../../motion/choreographies/floats'
import '../../motion/eases'

/* Reactions are rubber stamps, not like-buttons. Press sequence: stamp pop → a
   deliberate 280ms beat (the hook flips state) → pill fills and tilts −3° → glow
   ring → handwritten burst floats away. Ghost dashed pills show all four on your
   own card; elsewhere only nonzero pills render. */

interface Props {
  thought: Thought
  countFor: (t: Thought, key: StampKey) => number
  mineSet: Partial<Record<StampKey, boolean>>
  pressedId: string | null
  pressSeq: number
  onToggle: (key: StampKey) => void
}

function pressedKeyFor(thoughtId: string, pressedId: string | null): StampKey | null {
  if (!pressedId || !pressedId.startsWith(`${thoughtId}:`)) return null
  return pressedId.slice(thoughtId.length + 1) as StampKey
}

function Burst({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(() => {
    if (!ref.current) return
    if (prefersReducedMotion()) {
      gsap.set(ref.current, { autoAlpha: 0 })
      return
    }
    floatBurst(ref.current, REACTION.burst)
  }, [])
  return (
    <span className="gb-burst" ref={ref} aria-hidden>
      {text}
    </span>
  )
}

export function ReactionBar({ thought, countFor, mineSet, pressedId, pressSeq, onToggle }: Props) {
  const barRef = useRef<HTMLDivElement>(null)
  const own = !!thought.own
  const pressedKey = pressedKeyFor(thought.id, pressedId)

  // The stamp pop, fired at press time — before the count changes.
  useGSAP(
    () => {
      if (!pressedKey || prefersReducedMotion()) return
      const icon = barRef.current?.querySelector(`[data-stamp-ico="${pressedKey}"]`)
      if (!icon) return
      const d = REACTION.pop
      const tl = gsap.timeline()
      tl.fromTo(icon, { scale: 1, rotation: 0 }, { scale: 1.32, rotation: -9, duration: d * 0.25, ease: 'stampPop' })
        .to(icon, { scale: 0.9, rotation: 4, duration: d * 0.3, ease: 'stampPop' })
        .to(icon, { scale: 1, rotation: 0, duration: d * 0.45, ease: 'stampPop' })
      registerTimeline('reaction', tl)
    },
    { dependencies: [pressSeq] },
  )

  // The glow ring, fired when the press commits into the "on" state.
  useGSAP(
    () => {
      if (!pressedKey || !mineSet[pressedKey] || prefersReducedMotion()) return
      const pill = barRef.current?.querySelector(`[data-stamp="${pressedKey}"]`)
      if (!pill) return
      gsap
        .timeline({ delay: REACTION.glowDelay })
        .fromTo(
          pill,
          { boxShadow: '0 0 0 0 rgba(240,96,61,0)' },
          { boxShadow: '0 0 0 7px rgba(240,96,61,0.25)', duration: REACTION.glow * 0.4, ease: 'power1.out' },
        )
        .to(pill, { boxShadow: '0 0 0 0 rgba(240,96,61,0)', duration: REACTION.glow * 0.6, ease: 'power1.in' })
    },
    { dependencies: [mineSet] },
  )

  const pills = STAMPS.filter((s) => own || countFor(thought, s.key) > 0)

  return (
    <div className="gb-rbar" ref={barRef}>
      {pills.map((s) => {
        const on = !!mineSet[s.key]
        const count = countFor(thought, s.key)
        const ghost = count === 0
        const pressed = pressedKey === s.key
        return (
          <button
            key={s.key}
            data-stamp={s.key}
            className="gb-pill"
            title={s.label}
            aria-label={`${s.label}${ghost ? '' : ` — ${count}`}`}
            aria-pressed={on}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(s.key)
            }}
            style={{
              border: ghost
                ? '1.5px dashed color-mix(in srgb, var(--card-ink) 45%, transparent)'
                : `1.5px solid ${on ? 'var(--react-on-bg)' : 'var(--card-ink-soft)'}`,
              background: on ? 'var(--react-on-bg)' : 'transparent',
              color: on ? 'var(--react-on-fg)' : 'var(--card-ink)',
              opacity: ghost ? 0.72 : 1,
              // Resting tilt is the per-pill stamp angle from CSS (nth-child); a
              // pressed pill overrides it with a firmer −3° so it reads freshly stamped.
              transform: on ? 'rotate(-3deg)' : undefined,
            }}
          >
            <span className="gb-pill-ico" data-stamp-ico={s.key}>
              {s.ico}
            </span>
            {!ghost && <span className="gb-pill-n">{count}</span>}
            {pressed && on && <Burst text={s.burst} />}
          </button>
        )
      })}
    </div>
  )
}
