/* Dev-facing registry of the most recently run choreography timelines, so the
   tweaks panel can attach GSDevTools and scrub them. No-ops in production paths. */
/* gsap's types are declared as a global namespace — no runtime import needed here */
type Entry = { tl: gsap.core.Timeline; at: number }
const timelines = new Map<string, Entry>()

export function registerTimeline(name: string, tl: gsap.core.Timeline) {
  if (!import.meta.env.DEV) return
  timelines.set(name, { tl, at: Date.now() })
}

export function getTimeline(name: string): gsap.core.Timeline | undefined {
  return timelines.get(name)?.tl
}

export function timelineNames(): string[] {
  return [...timelines.keys()]
}
