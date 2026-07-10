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
  const [msg, setMsg] = useState<string | null>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hide = useCallback(() => {
    const el = hostRef.current
    if (!el) {
      setMsg(null)
      return
    }
    if (prefersReducedMotion()) {
      setMsg(null)
      return
    }
    gsap.to(el, { autoAlpha: 0, y: 8, duration: TOAST.out, ease: 'power2.in', onComplete: () => setMsg(null) })
  }, [])

  const show = useCallback<ShowToast>(
    (text, forMs = TOAST.liveForMs) => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      setMsg(text)
      hideTimer.current = setTimeout(hide, forMs)
    },
    [hide],
  )

  useGSAP(
    () => {
      const el = hostRef.current
      if (!el || !msg) return
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
    { dependencies: [msg] },
  )

  return (
    <ToastContext.Provider value={show}>
      {children}
      {msg && (
        <div className="toast" ref={hostRef} role="status">
          <span className="toast-pencil" aria-hidden>
            ✎
          </span>
          <span>{msg}</span>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
