import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { CURVES, type CurveName } from './tokens'

gsap.registerPlugin(CustomEase)

/* Register every spec'd cubic-bezier once, exactly, as a named CustomEase.
   Use ease('settle') anywhere a tween needs one. */
for (const [name, curve] of Object.entries(CURVES)) {
  CustomEase.create(name, curve)
}

export const ease = (name: CurveName): string => name
