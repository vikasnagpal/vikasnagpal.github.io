import { KEYS, readRaw, writeRaw } from './storage'

/** Stable anonymous visitor id — only ever used to make reactions one-per-visitor. */
export function getVisitorId(): string {
  let id = readRaw(KEYS.visitor)
  if (!id) {
    id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `v-${Date.now()}-${Math.floor(Math.random() * 1e9)}`
    writeRaw(KEYS.visitor, id)
  }
  return id
}
