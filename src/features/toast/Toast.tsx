import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { TOAST } from '../../motion/tokens'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import '../../motion/eases'
import './toast.css'

/* One shared toast, bottom-right, tilted like a note someone slid across the desk. */

type ShowToast = (msg: string, forMs?: number) => void

const ToastContext = createContext<ShowToast>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  // Each show() gets a fresh seq — re-showing the same text mid-fade still
  // re-runs the entrance (which overwrites the fade). On the bare text, React
  // bailed out of the no-op set, the old fade completed, and the "new" toast
  // vanished with it.
  const [note, setNote] = useState<{ text: string; seq: number } | null>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const seq = useRef(0)

  const hide = useCallback(() => {
    const el = hostRef.current
    if (!el || prefersReducedMotion()) {
      setNote(null)
      return
    }
    gsap.to(el, { autoAlpha: 0, y: 8, duration: TOAST.out, ease: 'power2.in', onComplete: () => setNote(null) })
  }, [])

  const show = useCallback<ShowToast>(
    (text, forMs = TOAST.showForMs) => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      seq.current += 1
      setNote({ text, seq: seq.current })
      hideTimer.current = setTimeout(hide, forMs)
    },
    [hide],
  )

  useGSAP(
    () => {
      const el = hostRef.current
      if (!el || !note) return
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1, y: 0, rotation: -1 })
        return
      }
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 12, rotation: -1 },
        { autoAlpha: 1, y: 0, rotation: -1, duration: TOAST.in, ease: 'power2.out', overwrite: 'auto' },
      )
    },
    { dependencies: [note?.seq] },
  )

  return (
    <ToastContext.Provider value={show}>
      {children}
      {note && (
        <div className="toast" ref={hostRef} role="status">
          <span className="toast-pencil" aria-hidden>
            ✎
          </span>
          <span>{note.text}</span>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
