import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { GuestbookApi } from './useGuestbook'
import { LIFT, NOTE_SHADOW, RAISED_SHADOW, nightShadow, slotLayout } from './deckLayout'
import { paperFor } from './paper'
import { QuoteCard } from './QuoteCard'
import { WriteCard } from './WriteCard'
import { ReactionBar } from './ReactionBar'
import { DECK } from '../../motion/tokens'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import { useAtmosphere } from '../atmosphere/atmosphere'
import '../../motion/eases'

/* The deck renders cards in stable DOM order (keyed by thought id) and GSAP moves
   them between slots. React owns structure, colors and z-index; GSAP owns
   transform, shadow and opacity — the two never write the same property. */

export function Deck({ gb }: { gb: GuestbookApi }) {
  const { night, pace } = useAtmosphere()
  const refs = useRef(new Map<string, HTMLDivElement>())
  const positioned = useRef(new WeakSet<Element>())
  // Last layout actually handed to GSAP, per card — cards whose target hasn't
  // moved are skipped entirely. With the live guestbook at 40 thoughts, a
  // breath tick would otherwise queue ~120 tweens for cards sitting invisible
  // at opacity 0.
  const lastApplied = useRef(new Map<string, string>())

  const { thoughts, order, phase, lastFlown, mode, entered, peek, breath, justAdded } = gb

  useGSAP(
    () => {
      const reduced = prefersReducedMotion()
      thoughts.forEach((th, idx) => {
        const el = refs.current.get(th.id)
        if (!el) return
        const p = order.indexOf(th.id)
        const isFront = p === 0
        const lifting = phase === 'lift' && isFront

        let L = lifting ? { ...LIFT } : { ...slotLayout(p) }
        if (!entered && !lifting && isFront) {
          L = { ...L, ty: L.ty + DECK.enterRaise.y, rot: L.rot + DECK.enterRaise.rot, sh: RAISED_SHADOW }
        }
        if (!lifting && isFront && th.id === justAdded) {
          L = { ...L, ty: L.ty + DECK.noteRaise.y, rot: L.rot + DECK.noteRaise.rot, sc: DECK.noteRaise.scale, sh: NOTE_SHADOW }
        }
        if (night && !lifting) {
          L = { ...L, sh: nightShadow(p) }
        }

        let { tx, ty, rot } = L
        if (entered && peek && phase === 'idle' && mode === 'read' && p >= 1 && L.op > 0) {
          tx += p === 1 ? -DECK.peek.x : DECK.peek.x
          ty += DECK.peek.y
        }
        if (!lifting && p >= 1) rot += DECK.jitter[idx % DECK.jitter.length]
        // Hidden cards don't breathe (nobody can see it) — their layout then
        // never changes between shuffles, so the memo below skips them.
        if (!lifting && p >= 1 && breath && L.op > 0) {
          ty += DECK.breath.y
          rot += DECK.breath.rot
        }

        const layoutKey = `${tx}|${ty}|${rot}|${L.sc}|${L.op}|${L.sh}`

        // First layout for a card is set, not tweened — entrances then animate out of it.
        if (!positioned.current.has(el)) {
          positioned.current.add(el)
          lastApplied.current.set(th.id, layoutKey)
          gsap.set(el, { x: tx, y: ty, rotation: rot, scale: L.sc, autoAlpha: L.op, boxShadow: L.sh })
          return
        }

        // Same target as last time → nothing to animate (any in-flight tween is
        // already headed there); skip the three gsap calls for this card.
        if (lastApplied.current.get(th.id) === layoutKey) return
        lastApplied.current.set(th.id, layoutKey)

        if (reduced) {
          gsap.set(el, { x: tx, y: ty, rotation: rot, scale: L.sc, autoAlpha: L.op, boxShadow: L.sh })
          return
        }

        const durT = (phase === 'lift' ? DECK.lift : phase === 'settle' ? DECK.settle : DECK.idle) * pace
        const durSh = (phase === 'lift' ? DECK.shadowLift : phase === 'settle' ? DECK.shadowSettle : DECK.shadowIdle) * pace
        const durOp = (phase === 'lift' ? DECK.opacityLift : phase === 'settle' ? DECK.opacitySettle : DECK.opacityIdle) * pace
        const easeName = phase === 'lift' ? 'lift' : phase === 'settle' ? 'settle' : 'idle'

        gsap.to(el, { x: tx, y: ty, rotation: rot, scale: L.sc, duration: durT, ease: easeName, overwrite: 'auto' })
        // shadow leads the movement — weight first
        gsap.to(el, { boxShadow: L.sh, duration: durSh, ease: 'power1.inOut', overwrite: 'auto' })
        gsap.to(el, { autoAlpha: L.op, duration: durOp, ease: 'power1.inOut', overwrite: 'auto' })
      })
    },
    { dependencies: [thoughts, order, phase, lastFlown, mode, entered, peek, breath, justAdded, night, pace] },
  )

  return (
    <div className="gb-deckwrap">
      {thoughts.map((th) => {
        const p = order.indexOf(th.id)
        const isFront = p === 0
        const lifting = phase === 'lift' && isFront
        const slot = lifting ? LIFT : slotLayout(p)
        const z = lifting ? 999 : th.id === lastFlown && phase === 'settle' ? 999 : slot.z

        return (
          <div
            key={th.id}
            ref={(el) => {
              if (el) refs.current.set(th.id, el)
              else refs.current.delete(th.id)
            }}
            className="gb-card"
            data-paper={isFront && mode === 'write' ? 'coral' : paperFor(th.id)}
            style={{
              zIndex: z,
              cursor: isFront && mode === 'read' ? 'pointer' : 'default',
            }}
            onClick={isFront && mode === 'read' ? gb.shuffle : undefined}
          >
            {isFront && mode === 'write' ? (
              <WriteCard gb={gb} />
            ) : (
              <QuoteCard
                thought={th}
                isFront={isFront}
                bar={
                  <ReactionBar
                    thought={th}
                    countFor={gb.countFor}
                    mineSet={gb.mine[th.id] ?? {}}
                    pressedId={gb.pressedId}
                    pressSeq={gb.pressSeq}
                    onToggle={(key) => gb.toggleReaction(th.id, key)}
                  />
                }
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
