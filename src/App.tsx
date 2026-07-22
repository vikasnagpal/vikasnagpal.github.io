import { Suspense, lazy, useEffect, useLayoutEffect } from 'react'
import { Redirect, Route, Switch, useLocation } from 'wouter'
import { ConfigProvider, useConfig } from './config'
import { consoleHint } from './lib/consoleHint'
import { AtmosphereProvider } from './features/atmosphere/atmosphere'
import { ToastProvider } from './features/toast/Toast'
import Home from './pages/Home'
import './app.css'

/* Providers wrap the router so atmosphere, config and toasts persist across
   navigation — the room stays the room; only the sheet on the desk changes.
   Home loads eagerly (it IS the site); inner pages are their own chunks. */

// Route changes own the scroll; the browser's automatic restoration fights
// that with stale offsets.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Every navigation lands at the top of the new page — one owner for scroll,
// so no page has to remember to reset it (Home didn't, and returning from a
// scrolled inner page left the visitor mid-desk).
function ScrollReset() {
  const [location] = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  return null
}

// The devtools breadcrumb for the coin (see lib/consoleHint.ts) — lives under
// the ConfigProvider so the dev tweaks toggle governs it.
function ConsoleHint() {
  const { discovery } = useConfig()
  useEffect(() => {
    if (discovery.consoleHint) consoleHint()
  }, [discovery.consoleHint])
  return null
}

const Work = lazy(() => import('./pages/Work'))
const Adventures = lazy(() => import('./pages/Adventures'))

// Dev-only fine-tuning workbench — tree-shaken out of production builds.
const TweaksPanel = import.meta.env.DEV ? lazy(() => import('./features/tweaks/TweaksPanel')) : null

export default function App() {
  return (
    <ConfigProvider>
      <AtmosphereProvider>
        <ToastProvider>
          <ScrollReset />
          <ConsoleHint />
          <div className="site">
            <Suspense fallback={null}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/work" component={Work} />
                <Route path="/adventures" component={Adventures} />
                <Route>
                  <Redirect to="/" />
                </Route>
              </Switch>
            </Suspense>
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
