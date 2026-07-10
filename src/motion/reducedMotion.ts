/** Decorative motion is skipped for visitors who prefer reduced motion;
    every state change still happens. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
