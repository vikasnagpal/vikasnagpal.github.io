import { Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'wouter'
import { ConfigProvider } from './config'
import { AtmosphereProvider } from './features/atmosphere/atmosphere'
import { ToastProvider } from './features/toast/Toast'
import Home from './pages/Home'
import './app.css'

/* Providers wrap the router so atmosphere, config and toasts persist across
   navigation — the room stays the room; only the sheet on the desk changes.
   Home loads eagerly (it IS the site); inner pages are their own chunks. */

// Route changes own the scroll (PageFrame lands each page at the top);
// the browser's automatic restoration fights that with stale offsets.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const Work = lazy(() => import('./pages/Work'))

// Dev-only fine-tuning workbench — tree-shaken out of production builds.
const TweaksPanel = import.meta.env.DEV ? lazy(() => import('./features/tweaks/TweaksPanel')) : null

export default function App() {
  return (
    <ConfigProvider>
      <AtmosphereProvider>
        <ToastProvider>
          <div className="site">
            <Suspense fallback={null}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/work" component={Work} />
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
