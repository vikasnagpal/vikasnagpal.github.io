import { Suspense, lazy, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ConfigProvider } from './config'
import { AtmosphereProvider } from './features/atmosphere/atmosphere'
import { ToastProvider } from './features/toast/Toast'
import { AtmospherePill } from './features/atmosphere/AtmospherePill'
import { Hero } from './features/hero/Hero'
import { NavTrio } from './features/nav/NavTrio'
import { PSBlock } from './features/contact/PSBlock'
import { Guestbook } from './features/guestbook/Guestbook'
import { introReveal } from './motion/choreographies/intro'
import { prefersReducedMotion } from './motion/reducedMotion'
import { registerTimeline } from './motion/registry'
import './app.css'

// Dev-only fine-tuning workbench — tree-shaken out of production builds.
const TweaksPanel = import.meta.env.DEV ? lazy(() => import('./features/tweaks/TweaksPanel')) : null

export default function App() {
  const siteRef = useRef<HTMLDivElement>(null)

  // The one-time composition entrance. Runs in useGSAP's layout effect (before paint),
  // so blocks fade up from hidden rather than popping in. Reduced motion keeps them put.
  useGSAP(
    () => {
      if (prefersReducedMotion() || !siteRef.current) return
      registerTimeline('intro', introReveal(siteRef.current))
    },
    { scope: siteRef },
  )

  return (
    <ConfigProvider>
      <AtmosphereProvider>
        <ToastProvider>
          <div className="site" ref={siteRef}>
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
