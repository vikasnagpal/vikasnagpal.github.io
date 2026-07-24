/** A touch device — coarse pointer, no true hover. box-shadow is a paint
    property, so tweening its blur every frame re-rasterizes the whole card
    layer; desktop GPUs absorb that, phones drop frames. The deck reads this to
    keep shadow off the per-frame path on touch (see Deck.tsx). */
export function isTouchDevice(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  )
}
