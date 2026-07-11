import gsap from 'gsap'
import { INTRO } from '../tokens'
import { ease } from '../eases'

/* The composition arrives once, on load: the left column rises and fades block by
   block (pill → greeting → intro → nav → P.S.) with the guestbook panel joining a beat
   in. Deliberately quiet — it frames the page, then hands off to the hero's ink
   flourish. Transform + opacity only, so it never disturbs the pixel-tuned spacing.

   Built inside useGSAP's layout effect, so the hidden start state is applied before the
   first paint — the blocks are never seen at full opacity first, then hidden. */
export function introReveal(scope: Element): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: ease('enter'), duration: INTRO.dur } })

  const column = scope.querySelectorAll<HTMLElement>('.site-left > *')
  const panel = scope.querySelector<HTMLElement>('.gb-panel')

  tl.from(column, { autoAlpha: 0, y: INTRO.y, stagger: INTRO.stagger }, 0)
  if (panel) tl.from(panel, { autoAlpha: 0, y: INTRO.y }, INTRO.panelDelay)

  return tl
}
