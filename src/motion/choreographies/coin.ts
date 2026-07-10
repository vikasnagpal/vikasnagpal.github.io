import gsap from 'gsap'
import { COIN } from '../tokens'
import '../eases'

/* The coin has real gravity: squash → launch → apex hang → begin to fall → fade
   mid-fall, with two Y-spins. The nav icon dips near the end as if catching it.
   Keyframe stops ported from the DC's coinPop (0 / 12 / 50 / 62 / 100%). */

export type CoinRare = 'none' | 'spin' | 'wobble'

interface CoinArcOpts {
  rare?: CoinRare
  reduced?: boolean
  onComplete?: () => void
}

export function coinArc(coin: Element, icon: Element | null, opts: CoinArcOpts = {}): gsap.core.Timeline {
  const D = COIN.arc
  const [s0, s1, s2, s3, s4] = COIN.stops
  const seg = (a: number, b: number) => D * (b - a)
  const tl = gsap.timeline({ onComplete: opts.onComplete })

  if (opts.reduced) {
    // No arc, no spin — the coin simply appears and fades (state still counts).
    tl.fromTo(coin, { xPercent: -50, y: -6, autoAlpha: 0 }, { autoAlpha: 1, duration: D * 0.25, ease: 'none' })
      .to(coin, { autoAlpha: 1, duration: D * 0.5, ease: 'none' })
      .to(coin, { autoAlpha: 0, duration: D * 0.25, ease: 'none' })
    return tl
  }

  const spinMult = opts.rare === 'spin' ? 1.55 : 1

  tl.fromTo(
    coin,
    { xPercent: -50, y: 2, scaleX: 1.15, scaleY: 0.72, rotationY: 0, autoAlpha: 0 },
    { y: COIN.rise.launch, scaleX: 0.94, scaleY: 1.1, rotationY: 90 * spinMult, autoAlpha: 1, duration: seg(s0, s1), ease: 'coinPop1' },
    0,
  )
    .to(coin, { y: COIN.rise.apex, scaleX: 1, scaleY: 1, rotationY: 430 * spinMult, duration: seg(s1, s2), ease: 'coinPop2' })
    .to(coin, { y: COIN.rise.hang, rotationY: 500 * spinMult, duration: seg(s2, s3), ease: 'power1.inOut' })
    .to(coin, { y: COIN.rise.fadeAt, rotationY: COIN.spins * spinMult, scaleX: 0.98, scaleY: 0.98, autoAlpha: 0, duration: seg(s3, s4), ease: 'coinFall' })

  if (icon) {
    tl.to(icon, { y: 2, rotation: 1.5, duration: D * 0.1, ease: 'power1.in' }, D * COIN.catchAt).to(
      icon,
      { y: 0, rotation: 0, duration: D * 0.16, ease: 'power1.out' },
      D * (COIN.catchAt + 0.1),
    )
    if (opts.rare === 'wobble') {
      // it lands unevenly, just once — unexplained
      tl.to(icon, { rotation: -1.6, duration: 0.09, ease: 'power1.inOut' })
        .to(icon, { rotation: 1, duration: 0.09, ease: 'power1.inOut' })
        .to(icon, { rotation: 0, duration: 0.12, ease: 'power1.out' })
    }
  }

  return tl
}

/** The subliminal tell: on the 2nd rapid re-entry the icon tilts 5° for a beat —
    the room creaking, not an instruction. */
export function tellTilt(icon: Element): gsap.core.Timeline {
  const tl = gsap.timeline()
  tl.to(icon, { rotation: COIN.tellDeg, y: -1, duration: COIN.tell * 0.4, ease: 'power1.out' }).to(icon, {
    rotation: 0,
    y: 0,
    duration: COIN.tell * 0.6,
    ease: 'power1.inOut',
  })
  return tl
}
