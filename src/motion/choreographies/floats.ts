import gsap from 'gsap'

/* A handwritten line floats up and fades — shared by reaction bursts ("Mind shifted!")
   and the coin's one-time "Nice catch." Ported from the DC's burstFloat keyframes. */
export function floatBurst(el: Element, dur = 1.9): gsap.core.Timeline {
  const tl = gsap.timeline()
  tl.fromTo(
    el,
    { xPercent: -50, y: 0, scale: 0.8, autoAlpha: 0 },
    { y: -8, scale: 1.05, autoAlpha: 1, duration: dur * 0.12, ease: 'power1.out' },
  )
    .to(el, { y: -10, scale: 1, duration: dur * 0.58, ease: 'none' })
    .to(el, { y: -30, autoAlpha: 0, duration: dur * 0.3, ease: 'power1.in' })
  return tl
}
