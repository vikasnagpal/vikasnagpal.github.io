import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

/* Site-level tweakable props (the DC's host Tweaks panel, as React context).
   Production uses the defaults; the dev tweaks panel patches them live. */

export type WeatherOverride = 'auto' | 'clear' | 'partly' | 'cloudy' | 'rain' | 'thunder' | 'fog'
export type SeasonOverride = 'auto' | 'spring' | 'monsoon' | 'autumn' | 'winter'

/** Coin discovery aids — the scent trail (see DISCOVERY in motion/tokens.ts).
    All flags ship-ready defaults; the dev tweaks panel flips them for review. */
export interface DiscoveryFlags {
  /** slow re-entry gets a fainter tell — opens the top of the funnel */
  whisper: boolean
  /** desktop on-icon wiggle counts as entries + widened trigger window */
  wiggle: boolean
  /** a coin edge peeks from behind an icon (once per session, pre-discovery only) */
  glint: boolean
  /** the glint only for returning visitors */
  returningOnly: boolean
  /** oblique devtools console line, pre-discovery only */
  consoleHint: boolean
}

export interface SiteConfig {
  weatherOverride: WeatherOverride
  seasonOverride: SeasonOverride
  calendarUrl: string
  discovery: DiscoveryFlags
}

const DEFAULTS: SiteConfig = {
  weatherOverride: 'auto',
  seasonOverride: 'auto',
  calendarUrl: (import.meta.env.VITE_CALENDAR_URL as string | undefined) || '#',
  discovery: {
    whisper: true,
    wiggle: true,
    glint: true,
    returningOnly: true,
    consoleHint: true,
  },
}

const ConfigContext = createContext<SiteConfig>(DEFAULTS)
const ConfigPatchContext = createContext<(patch: Partial<SiteConfig>) => void>(() => {})

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULTS)
  const patch = useCallback((p: Partial<SiteConfig>) => setConfig((c) => ({ ...c, ...p })), [])
  return (
    <ConfigContext.Provider value={config}>
      <ConfigPatchContext.Provider value={patch}>{children}</ConfigPatchContext.Provider>
    </ConfigContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigContext)
export const useConfigPatch = () => useContext(ConfigPatchContext)
