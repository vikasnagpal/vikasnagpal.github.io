import { useEffect, useRef, useState } from 'react'
import { DAYPARTS, useAtmosphere } from './atmosphere'
import { useClock } from './useClock'
import { useWeather } from './useWeather'
import { CheckIcon, DaypartIcon, WeatherIcon } from './icons'
import type { Daypart } from '../../lib/ist'
import './atmosphere.css'

const ORDER: Daypart[] = ['morning', 'evening', 'night']

export function AtmospherePill() {
  const atmo = useAtmosphere()
  const time = useClock()
  const weather = useWeather()
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // The dropdown closes on any outside click.
  useEffect(() => {
    if (!menuOpen) return
    const close = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [menuOpen])

  return (
    <div className="atmo-wrap">
      <div className="atmo-pill" ref={wrapRef}>
        <span className="atmo-loc">
          <WeatherIcon kind={weather.kind} night={weather.night} />
          <span className="atmo-loc-label">Bangalore, {time}</span>
        </span>
        <span className="atmo-div" />
        <button
          className="atmo-btn"
          aria-label="Change the atmosphere"
          title="Change the atmosphere."
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="atmo-ico" key={atmo.daypart}>
            <DaypartIcon part={atmo.daypart} />
          </span>
          <span>{DAYPARTS[atmo.daypart].name}</span>
          <svg
            className="atmo-chev"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            style={{ transform: menuOpen ? 'rotate(180deg)' : 'none' }}
          >
            <path d="M5 9 L12 16 L19 9" />
          </svg>
        </button>

        {menuOpen && (
          <div className="atmo-menu">
            {ORDER.map((dp) => (
              <button
                key={dp}
                className="atmo-row"
                onClick={() => {
                  atmo.choose(dp)
                  setMenuOpen(false)
                }}
              >
                <DaypartIcon part={dp} size={18} glow={false} />
                <span className="atmo-row-main">
                  <span className="atmo-row-name">{DAYPARTS[dp].name}</span>
                  <span className="atmo-row-tag">{DAYPARTS[dp].tagline}</span>
                </span>
                {atmo.daypart === dp && <CheckIcon />}
              </button>
            ))}
            <div className="atmo-auto">
              <span className="atmo-auto-label">Auto mode (follows my local time)</span>
              <button
                className="atmo-switch"
                role="switch"
                aria-checked={atmo.auto}
                aria-label="Toggle auto atmosphere"
                onClick={() => atmo.toggleAuto()}
                style={{ background: atmo.auto ? 'var(--accent)' : 'color-mix(in srgb, var(--ink) 28%, transparent)' }}
              >
                <span className="atmo-knob" style={{ transform: `translateX(${atmo.auto ? 18 : 0}px)` }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
