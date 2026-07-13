import gsap from 'gsap'
import { PAGE } from '../tokens'
import { ease } from '../eases'

/* Inner pages rise like a sheet of paper picked up off the desk — the same
   quiet grammar as the home arrival (INTRO), but lighter and quicker: this
   page was already in the room. Transform + opacity only. */
export function pageEnter(scope: Element): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: ease('enter'), duration: PAGE.dur } })
  tl.from(scope.children, { autoAlpha: 0, y: PAGE.y, stagger: PAGE.stagger }, 0)
  return tl
}
