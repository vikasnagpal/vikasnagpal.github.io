import type { WeatherKind } from './useWeather'
import type { Daypart } from '../../lib/ist'

/* Hand-drawn stroke icons, ported verbatim from the design component.
   Night variants (moon instead of sun) are drawn in the same stroke language —
   a clear 9pm sky must never show a sun. */

export function WeatherIcon({ kind, night = false }: { kind: WeatherKind; night?: boolean }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  } as const

  switch (kind) {
    case 'clear':
      return night ? (
        <svg {...common}>
          <path d="M19.4 13.9 A7.8 7.8 0 1 1 10.1 4.6 A6.1 6.1 0 0 0 19.4 13.9 Z" />
          <path d="M18.7 4.2 V7 M17.3 5.6 H20.1" />
        </svg>
      ) : (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 3 V5 M12 19 V21 M3 12 H5 M19 12 H21 M5.6 5.6 L7 7 M17 17 L18.4 18.4 M18.4 5.6 L17 7 M7 17 L5.6 18.4" />
        </svg>
      )
    case 'partly':
      return night ? (
        <svg {...common}>
          <path d="M11.1 8 A3.6 3.6 0 1 1 6.9 3.8 A2.8 2.8 0 0 0 11.1 8 Z" />
          <path d="M9 20 C6.5 20 5 18.3 5.2 16.2 C5.4 14.6 6.8 13.6 8.2 13.9 C8.7 11.9 10.5 10.5 12.6 10.5 C15 10.5 16.8 12.3 17 14.5 C18.9 14.4 20.3 15.7 20.3 17.4 C20.3 18.9 19.2 20 17.7 20 Z" />
        </svg>
      ) : (
        <svg {...common}>
          <circle cx="8.5" cy="7.5" r="3" />
          <path d="M8.5 2.2 V3.4 M3.2 7.5 H4.4 M4.8 3.8 L5.6 4.6 M13 4 L12.2 4.8" />
          <path d="M9 20 C6.5 20 5 18.3 5.2 16.2 C5.4 14.6 6.8 13.6 8.2 13.9 C8.7 11.9 10.5 10.5 12.6 10.5 C15 10.5 16.8 12.3 17 14.5 C18.9 14.4 20.3 15.7 20.3 17.4 C20.3 18.9 19.2 20 17.7 20 Z" />
        </svg>
      )
    case 'rain':
      return (
        <svg {...common}>
          <path d="M7 15 C4.2 15 2.5 13 2.8 10.6 C3 8.7 4.7 7.6 6.3 7.9 C6.8 5.6 8.9 4 11.3 4 C14 4 16 6 16.2 8.6 C18.4 8.5 20 10 20 12 C20 13.7 18.7 15 17 15 Z" />
          <path d="M8 18 L7 20.5 M12 18 L11 20.5 M16 18 L15 20.5" />
        </svg>
      )
    case 'thunder':
      return (
        <svg {...common}>
          <path d="M7 15 C4.2 15 2.5 13 2.8 10.6 C3 8.7 4.7 7.6 6.3 7.9 C6.8 5.6 8.9 4 11.3 4 C14 4 16 6 16.2 8.6 C18.4 8.5 20 10 20 12 C20 13.7 18.7 15 17 15 Z" />
          <path d="M12.2 16 L10.2 19.4 H13 L11 23" />
        </svg>
      )
    case 'fog':
      return (
        <svg {...common}>
          <path d="M7 15 C4.2 15 2.5 13 2.8 10.6 C3 8.7 4.7 7.6 6.3 7.9 C6.8 5.6 8.9 4 11.3 4 C14 4 16 6 16.2 8.6 C18.4 8.5 20 10 20 12 C20 13.7 18.7 15 17 15 Z" />
          <path d="M6 18.2 H15 M8.5 21 H17" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M7 17 C4.2 17 2.5 15 2.8 12.6 C3 10.7 4.7 9.6 6.3 9.9 C6.8 7.6 8.9 6 11.3 6 C14 6 16 8 16.2 10.6 C18.4 10.5 20 12 20 14 C20 15.7 18.7 17 17 17 Z" />
        </svg>
      )
  }
}

export function DaypartIcon({ part, size = 17, glow = true }: { part: Daypart; size?: number; glow?: boolean }) {
  if (part === 'morning') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden style={glow ? { filter: 'drop-shadow(0 0 5px rgba(238,123,43,0.45))' } : undefined}>
        <circle cx="12" cy="12" r="4.6" fill="#ee7b2b" />
        <g stroke="#ee7b2b" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2.6 L12 4.6 M12 19.4 L12 21.4 M2.6 12 L4.6 12 M19.4 12 L21.4 12 M5.2 5.2 L6.6 6.6 M17.4 17.4 L18.8 18.8 M18.8 5.2 L17.4 6.6 M6.6 17.4 L5.2 18.8" />
        </g>
      </svg>
    )
  }
  if (part === 'evening') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden style={{ display: 'block', ...(glow ? { filter: 'drop-shadow(0 0 5px rgba(224,116,47,0.5))' } : {}) }}>
        <circle cx="12" cy="11.5" r="4.2" fill="#e0742f" />
        <g stroke="#e0742f" strokeWidth="1.9" strokeLinecap="round">
          <path d="M12 3.2 V5.1 M5.4 5.9 L6.8 7.3 M18.6 5.9 L17.2 7.3" />
          <path d="M3.5 16.5 H20.5" />
          <path d="M6.5 20 H10 M14 20 H17.5" />
        </g>
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={glow ? { filter: 'drop-shadow(0 0 6px rgba(255,133,96,0.55))' } : undefined}>
      <path d="M20.5 14.6 A8.6 8.6 0 1 1 9.3 3.4 A6.7 6.7 0 0 0 20.5 14.6 Z" fill="#ff8560" />
      <path d="M18.2 2.6 l0.55 1.55 1.55 0.55 -1.55 0.55 -0.55 1.55 -0.55 -1.55 -1.55 -0.55 1.55 -0.55 Z" fill="#ff8560" />
    </svg>
  )
}

export function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12.5 L9.5 18 L20 6.5" />
    </svg>
  )
}
