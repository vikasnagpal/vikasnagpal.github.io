import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { ROUTES, SITE_ORIGIN } from './src/lib/routeMeta'
import { bootScript } from './src/lib/atmosphereBoot'

/* The pre-paint atmosphere script (theme/treatment on <html> before first
   paint, so themed borders never flash) is generated from the same module the
   app reads its daypart map, hour windows and TTL from — one source, no
   hand-synced copy in index.html to drift. Runs in dev and build alike. */
function atmosphereBoot(): Plugin {
  return {
    name: 'atmosphere-boot',
    transformIndexHtml(html) {
      return html.replace('<!-- @atmosphere-boot -->', () => `<script>\n      ${bootScript()}\n    </script>`)
    },
  }
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/* GitHub Pages has no rewrites: unknown paths fall back to 404.html, which
   renders the SPA but answers with a 404 status — so crawlers skip inner routes
   and link previews show home's meta. Emitting a real dist/<path>/index.html
   per route (home's shell with that route's title/description/OG stamped in,
   from the same routeMeta the pages use at runtime) gives every route a 200
   and its own preview. 404.html stays for genuinely unknown paths. */
function routeHtml(): Plugin {
  let outDir = ''
  return {
    name: 'route-html',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const shell = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      writeFileSync(resolve(outDir, '404.html'), shell)
      for (const route of ROUTES) {
        const title = escapeHtml(route.title)
        const desc = escapeHtml(route.description)
        const url = `${SITE_ORIGIN}${route.path}`
        const html = shell
          .replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, (_, a, b) => a + desc + b)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, (_, a, b) => a + title + b)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, (_, a, b) => a + desc + b)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, (_, a, b) => a + url + b)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, (_, a, b) => a + url + b)
        const dir = resolve(outDir, route.path.replace(/^\//, ''))
        mkdirSync(dir, { recursive: true })
        writeFileSync(resolve(dir, 'index.html'), html)
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  // The '#' fallback in config.tsx ships a dead "Grab some time" button when
  // VITE_CALENDAR_URL is missing — make that loud instead of silent: fail the
  // build in CI (the deploy vars must be set), warn locally (offline dev is fine).
  const env = loadEnv(mode, process.cwd())
  if (mode === 'production' && !env.VITE_CALENDAR_URL) {
    const msg = 'VITE_CALENDAR_URL is unset — the "Grab some time" CTA would ship as a dead link (#).'
    if (process.env.CI) throw new Error(msg)
    console.warn(`\n  ⚠ ${msg}\n`)
  }

  return {
    plugins: [react(), atmosphereBoot(), routeHtml()],
  }
})
