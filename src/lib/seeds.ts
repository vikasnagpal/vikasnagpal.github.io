/* Guestbook domain types + the curated seed thoughts. These double as the
   offline/fallback dataset when Supabase isn't configured — ids match the fixed
   uuids inserted by supabase/migrations/0002_refresh_thoughts.sql. */

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
    text: "Life moves pretty fast. If you don't stop and look around once in a while, you could miss it.",
    emoji: '😄',
    day: '09',
    mon: 'Jul',
    yr: '26',
    baseReactions: { rock_on: 9, lightbulb: 5, coffee: 7, doodle: 4 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000002',
    text: 'what you take, owns you. What you give, sets you free',
    emoji: '💛',
    day: '04',
    mon: 'Jul',
    yr: '26',
    baseReactions: { rock_on: 4, lightbulb: 6, coffee: 5, doodle: 10 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000003',
    text: 'Never attribute to malice that which is adequately explained by incompetence',
    emoji: '🤔',
    day: '26',
    mon: 'Jun',
    yr: '26',
    baseReactions: { rock_on: 7, lightbulb: 9, coffee: 3, doodle: 5 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000004',
    text: 'Curiosity without a means to satisfy it is frustrating.',
    emoji: '📚',
    day: '19',
    mon: 'Jun',
    yr: '26',
    baseReactions: { rock_on: 5, lightbulb: 8, coffee: 6, doodle: 3 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000005',
    text: 'kyu darein ke zindagi me kya hoga, kuch na hoga toh tajurba hoga',
    emoji: '✌️',
    day: '16',
    mon: 'Jun',
    yr: '26',
    baseReactions: { rock_on: 10, lightbulb: 4, coffee: 7, doodle: 6 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000006',
    text: 'a moving man surely meets his luck, the road favours the traveller',
    emoji: '🌿',
    day: '07',
    mon: 'Jun',
    yr: '26',
    baseReactions: { rock_on: 8, lightbulb: 3, coffee: 5, doodle: 7 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000007',
    text: 'We only get to sample a small taste of everything life has to offer, but in choosing deliberately, we are doing the most important job we were brought here to do',
    emoji: '☕',
    day: '01',
    mon: 'Jun',
    yr: '26',
    baseReactions: { rock_on: 6, lightbulb: 10, coffee: 4, doodle: 8 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000008',
    text: 'You already know what to do, you are just negotiating with comfort',
    emoji: '🎧',
    day: '28',
    mon: 'May',
    yr: '26',
    baseReactions: { rock_on: 7, lightbulb: 6, coffee: 9, doodle: 3 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000009',
    text: 'You can tell a lot about a tool by how it treats you when you make a mistake.',
    emoji: '🌸',
    day: '20',
    mon: 'May',
    yr: '26',
    baseReactions: { rock_on: 9, lightbulb: 5, coffee: 8, doodle: 4 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000010',
    text: 'Desire paths are the ground quietly disagreeing with the architect.',
    emoji: '🌱',
    day: '16',
    mon: 'May',
    yr: '26',
    baseReactions: { rock_on: 5, lightbulb: 9, coffee: 4, doodle: 6 },
  },
  {
    id: '5eed0000-0000-4000-8000-000000000011',
    text: 'The queue always feels faster when you can see it moving.',
    emoji: '🤔',
    day: '12',
    mon: 'May',
    yr: '26',
    baseReactions: { rock_on: 3, lightbulb: 6, coffee: 7, doodle: 5 },
  },
]
