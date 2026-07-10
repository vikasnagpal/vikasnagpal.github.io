import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

/* Site-level tweakable props (the DC's host Tweaks panel, as React context).
   Production uses the defaults; the dev tweaks panel patches them live. */

export type WeatherOverride = 'auto' | 'clear' | 'partly' | 'cloudy' | 'rain' | 'thunder' | 'fog'
export type SeasonOverride = 'auto' | 'spring' | 'monsoon' | 'autumn' | 'winter'

export interface SiteConfig {
  weatherOverride: WeatherOverride
  seasonOverride: SeasonOverride
  shuffleOnLoad: boolean
  calendarUrl: string
}

const DEFAULTS: SiteConfig = {
  weatherOverride: 'auto',
  seasonOverride: 'auto',
  shuffleOnLoad: false,
  calendarUrl: (import.meta.env.VITE_CALENDAR_URL as string | undefined) || '#',
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
