/* Route metadata — one source of truth, read from two sides:
   at runtime each page hands its entry to PageFrame (→ usePageMeta), and at
   build time vite.config's routeHtml plugin stamps the same values into a real
   dist/<path>/index.html so GitHub Pages serves inner routes with a 200 and
   correct link previews. Keep this module pure (no import.meta.env, no DOM):
   vite.config imports it under Node. */

export const SITE_ORIGIN = 'https://vikasnagpal.com'

export interface RouteMeta {
  path: string
  title: string
  description: string
}

export const WORK: RouteMeta = {
  path: '/work',
  title: 'Work together — Vikas',
  description: 'Three ways to work with Vikas: founding designer, design advisory, or a fractional design head.',
}

export const ADVENTURES: RouteMeta = {
  path: '/adventures',
  title: 'Past adventures — Vikas',
  description: 'A field guide to where Vikas has worked: Membean, Titan.Email, Strategy.Zero, and Rhythm & Hues.',
}

/** Every client route beyond home — each gets its own HTML shell at build. */
export const ROUTES: RouteMeta[] = [WORK, ADVENTURES]
