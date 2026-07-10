import { Suspense, lazy } from 'react'
import { ConfigProvider } from './config'
import { AtmosphereProvider } from './features/atmosphere/atmosphere'
import { ToastProvider } from './features/toast/Toast'
import { AtmospherePill } from './features/atmosphere/AtmospherePill'
import { Hero } from './features/hero/Hero'
import { NavTrio } from './features/nav/NavTrio'
import { PSBlock } from './features/contact/PSBlock'
import { Guestbook } from './features/guestbook/Guestbook'
import './app.css'

// Dev-only fine-tuning workbench — tree-shaken out of production builds.
const TweaksPanel = import.meta.env.DEV ? lazy(() => import('./features/tweaks/TweaksPanel')) : null

export default function App() {
  return (
    <ConfigProvider>
      <AtmosphereProvider>
        <ToastProvider>
          <div className="site">
            <div className="site-grid" data-two-col>
              <div className="site-left">
                <AtmospherePill />
                <Hero />
                <NavTrio />
                <PSBlock />
              </div>
              <Guestbook />
            </div>
          </div>
          {TweaksPanel && (
            <Suspense fallback={null}>
              <TweaksPanel />
            </Suspense>
          )}
        </ToastProvider>
      </AtmosphereProvider>
    </ConfigProvider>
  )
}
