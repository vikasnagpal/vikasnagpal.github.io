import { useState } from 'react'
import gsap from 'gsap'
import { useConfig, useConfigPatch, type SeasonOverride, type WeatherOverride } from '../../config'
import { DAYPARTS, useAtmosphere } from '../atmosphere/atmosphere'
import { timelineNames, getTimeline } from '../../motion/registry'
import { KEYS, remove } from '../../lib/storage'
import { useToast } from '../toast/Toast'
import type { Daypart } from '../../lib/ist'
import './tweaks.css'

/* The fine-tuning workbench. Dev-only: overrides every DC tweak prop, scrubs the
   registered choreography timelines with GSDevTools, and slows the whole room down. */

declare global {
  interface Window {
    __gsdev?: { kill: () => void }
  }
}

const WEATHERS: WeatherOverride[] = ['auto', 'clear', 'partly', 'cloudy', 'rain', 'thunder', 'fog']
const SEASONS: SeasonOverride[] = ['auto', 'spring', 'monsoon', 'autumn', 'winter']

export default function TweaksPanel() {
  const [open, setOpen] = useState(false)
  const config = useConfig()
  const patch = useConfigPatch()
  const atmo = useAtmosphere()
  const toast = useToast()
  const [scale, setScale] = useState(1)
  const [devtools, setDevtools] = useState(false)
  const [names, setNames] = useState<string[]>([])

  const attach = async (name: string) => {
    const mod = await import('gsap/GSDevTools')
    gsap.registerPlugin(mod.GSDevTools)
    window.__gsdev?.kill()
    const animation = name === 'global' ? undefined : getTimeline(name)
    window.__gsdev = mod.GSDevTools.create(animation ? { animation } : {})
    setDevtools(true)
  }

  const detach = () => {
    window.__gsdev?.kill()
    window.__gsdev = undefined
    setDevtools(false)
  }

  const reset = (key: string) => {
    remove(key)
    location.reload()
  }

  if (!open) {
    return (
      <button className="tw-fab" onClick={() => setOpen(true)} title="Tweaks">
        ⚙
      </button>
    )
  }

  return (
    <div className="tw-panel">
      <div className="tw-head">
        <span>tweaks</span>
        <button className="tw-x" onClick={() => setOpen(false)} aria-label="Close tweaks">
          ×
        </button>
      </div>

      <label className="tw-row">
        <span>atmosphere</span>
        <select value={atmo.daypart} onChange={(e) => atmo.choose(e.target.value as Daypart)}>
          {(Object.keys(DAYPARTS) as Daypart[]).map((dp) => (
            <option key={dp} value={dp}>
              {DAYPARTS[dp].name}
            </option>
          ))}
        </select>
      </label>
      <label className="tw-row">
        <span>auto mode</span>
        <input type="checkbox" checked={atmo.auto} onChange={() => atmo.toggleAuto()} />
      </label>
      <label className="tw-row">
        <span>weather</span>
        <select value={config.weatherOverride} onChange={(e) => patch({ weatherOverride: e.target.value as WeatherOverride })}>
          {WEATHERS.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>
      </label>
      <label className="tw-row">
        <span>season</span>
        <select value={config.seasonOverride} onChange={(e) => patch({ seasonOverride: e.target.value as SeasonOverride })}>
          {SEASONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="tw-row">
        <span>time scale {scale.toFixed(2)}×</span>
        <input
          type="range"
          min="0.05"
          max="2"
          step="0.05"
          value={scale}
          onChange={(e) => {
            const v = Number(e.target.value)
            setScale(v)
            gsap.globalTimeline.timeScale(v)
          }}
        />
      </label>

      <div className="tw-row">
        <span>scrub</span>
        <span className="tw-actions">
          <select id="tw-tl" onFocus={() => setNames(timelineNames())} defaultValue="global">
            <option value="global">global</option>
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button onClick={() => void attach((document.getElementById('tw-tl') as HTMLSelectElement).value)}>attach</button>
          {devtools && <button onClick={detach}>kill</button>}
        </span>
      </div>

      <div className="tw-row tw-resets">
        <button onClick={() => reset(KEYS.lastVisit)}>reset visit</button>
        <button onClick={() => reset(KEYS.coins)}>reset coins</button>
        <button onClick={() => reset(KEYS.reactions)}>reset reactions</button>
        <button onClick={() => reset(KEYS.atmosphere)}>reset atmo</button>
      </div>

      <div className="tw-row">
        <button onClick={() => toast('A test note slid across the desk.')}>fire toast</button>
      </div>
    </div>
  )
}
