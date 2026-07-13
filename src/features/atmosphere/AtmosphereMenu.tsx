import { DAYPARTS, useAtmosphere } from './atmosphere'
import { CheckIcon, DaypartIcon } from './icons'
import type { Daypart } from '../../lib/ist'

const ORDER: Daypart[] = ['morning', 'evening', 'night']

/* The shared mood menu — opened by the pill on the desk and the lamp on
   inner pages. One source of truth for the moods, taglines and auto mode. */

export function AtmosphereMenu({ onPick }: { onPick: () => void }) {
  const atmo = useAtmosphere()

  return (
    <div className="atmo-menu">
      {ORDER.map((dp) => (
        <button
          key={dp}
          className="atmo-row"
          onClick={() => {
            atmo.choose(dp)
            onPick()
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
  )
}
