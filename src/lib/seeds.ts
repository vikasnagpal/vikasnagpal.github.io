/* Guestbook domain types + the six designed seed thoughts. These double as the
   offline/fallback dataset when Supabase isn't configured — ids match the fixed
   uuids inserted by supabase/migrations/0001_guestbook.sql. */

export type StampKey = 'rock_on' | 'lightbulb' | 'coffee' | 'doodle'

export interface Stamp {
  key: StampKey
  ico: string
  label: string
  burst: string
}

export const STAMPS: Stamp[] = [
  { key: 'rock_on', ico: '🤘', label: 'Rock on', burst: 'Solid point!' },
  { key: 'lightbulb', ico: '💡', label: 'Made me think', burst: 'Mind shifted!' },
  { key: 'coffee', ico: '☕', label: 'Cozy one', burst: 'Sipping on this!' },
  { key: 'doodle', ico: '❤️', label: 'Love this', burst: 'Love this!' },
]

export type ReactionCounts = Partial<Record<StampKey, number>>

export interface Thought {
  id: string
  text: string
  emoji: string
  day: string
  mon: string
  yr: string
  baseReactions: ReactionCounts
  /** written by this visitor in this session (shows ghost pills, gets the 26s first Rock on) */
  own?: boolean
}

export const SEEDS: Thought[] = [
  {
    id: '5eed0000-0000-4000-8000-000000000001',
    text: 'You can tell a lot about a tool by how it treats you when you make a mistake.',
    emoji: '🤘',
    day: '22',
    mon: 'Jul',
    yr: '26',
    baseReactions: { rock_on: 12, lightbulb: 5, coffee: 8, doodle: 3 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000002',
    text: 'I learned to care about a foam pattern on a wave nobody would ever see.',
    emoji: '🌊',
    day: '18',
    mon: 'Jul',
    yr: '26',
    baseReactions: { rock_on: 2, lightbulb: 4, coffee: 6, doodle: 9 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000003',
    text: 'Desire paths are the ground quietly disagreeing with the architect.',
    emoji: '🌱',
    day: '15',
    mon: 'Jul',
    yr: '26',
    baseReactions: { rock_on: 4, lightbulb: 11, coffee: 3, doodle: 5 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000004',
    text: 'Airlines board planes in the slowest possible order and everyone just accepts it.',
    emoji: '✈️',
    day: '11',
    mon: 'Jul',
    yr: '26',
    baseReactions: { rock_on: 7, lightbulb: 2, coffee: 5, doodle: 1 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000005',
    text: 'The queue always feels faster when you can see it moving.',
    emoji: '🤔',
    day: '07',
    mon: 'Jul',
    yr: '26',
    baseReactions: { rock_on: 1, lightbulb: 3, coffee: 4, doodle: 2 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000006',
    text: "A good checkout flow is one you can't remember afterwards.",
    emoji: '✨',
    day: '03',
    mon: 'Jul',
    yr: '26',
    baseReactions: { rock_on: 3, lightbulb: 6, coffee: 10, doodle: 4 },
  },
]
