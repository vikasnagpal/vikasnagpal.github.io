import { useEffect, type RefObject } from 'react'

/* Shared dismissal grammar for the small floating surfaces (atmosphere menus,
   emoji popover): a click outside — or Escape — closes them. Pass a container
   ref to scope what counts as "inside"; omit it to close on any document click
   (callers stop propagation on the clicks that should survive). */
export function useDismiss(active: boolean, onDismiss: () => void, container?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return
    const onClick = (e: MouseEvent) => {
      if (container?.current?.contains(e.target as Node)) return
      onDismiss()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [active, onDismiss, container])
}
