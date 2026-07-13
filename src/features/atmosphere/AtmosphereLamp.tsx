import { useEffect, useRef, useState } from 'react'
import { useAtmosphere } from './atmosphere'
import { AtmosphereMenu } from './AtmosphereMenu'
import { DaypartIcon } from './icons'
import './atmosphere.css'

/* The room's lamp, for pages away from the desk. Just the daypart glyph —
   no location, time or weather (those are the desk's window, not the lamp).
   Opens the same mood menu as the pill. */

export function AtmosphereLamp() {
  const atmo = useAtmosphere()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // The dropdown closes on any outside click.
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])

  return (
    <div className="atmo-lamp" ref={wrapRef}>
      <button
        className="atmo-lamp-btn"
        aria-label="Change the atmosphere"
        title="Change the atmosphere."
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="atmo-ico" key={atmo.daypart}>
          <DaypartIcon part={atmo.daypart} size={20} />
        </span>
      </button>
      {open && <AtmosphereMenu onPick={() => setOpen(false)} />}
    </div>
  )
}
