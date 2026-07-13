import gsap from 'gsap'
import { PAGE } from '../tokens'
import { ease } from '../eases'

/* Inner pages rise like a sheet of paper picked up off the desk — the same
   quiet grammar as the home arrival (INTRO), but lighter and quicker: this
   page was already in the room. Transform + opacity only. */
export function pageEnter(scope: Element): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: ease('enter'), duration: PAGE.dur } })
  // clearProps: a leftover inline transform (even translate(0,0)) makes every
  // block a stacking context, and later siblings then paint over earlier ones —
  // burying the lamp's dropdown under the page text.
  tl.from(scope.children, { autoAlpha: 0, y: PAGE.y, stagger: PAGE.stagger, clearProps: 'transform' }, 0)
  return tl
}
