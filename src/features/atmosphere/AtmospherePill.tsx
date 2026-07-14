import { useRef, useState } from 'react'
import { useDismiss } from '../../lib/useDismiss'
import { DAYPARTS, useAtmosphere } from './atmosphere'
import { AtmosphereMenu } from './AtmosphereMenu'
import { useClock } from './useClock'
import { useWeather } from './useWeather'
import { DaypartIcon, WeatherIcon } from './icons'
import './atmosphere.css'

export function AtmospherePill() {
  const atmo = useAtmosphere()
  const time = useClock()
  const weather = useWeather()
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // The dropdown closes on any outside click, or Escape.
  useDismiss(menuOpen, () => setMenuOpen(false), wrapRef)

  return (
    <div className="atmo-wrap">
      <div className="atmo-pill" ref={wrapRef}>
        <span className="atmo-loc">
          <WeatherIcon kind={weather} />
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

        {menuOpen && <AtmosphereMenu onPick={() => setMenuOpen(false)} />}
      </div>
    </div>
  )
}
