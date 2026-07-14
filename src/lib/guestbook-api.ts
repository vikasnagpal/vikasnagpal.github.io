import { istDateParts } from './ist'
import type { ReactionCounts, StampKey, Thought } from './seeds'

/* Thin fetch-based data layer over Supabase's PostgREST — no supabase-js.
   When env vars are absent the site runs fully offline on the seeded guestbook;
   every remote write is fire-and-forget so the room never stutters on network. */

const SUPA_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '')
const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isConfigured: boolean = Boolean(SUPA_URL && SUPA_KEY)

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SUPA_URL}${path}`, {
    ...init,
    headers: {
      apikey: SUPA_KEY!,
      Authorization: `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) throw new Error(`supabase ${res.status}`)
  const text = await res.text()
  return (text ? JSON.parse(text) : null) as T
}

interface ThoughtRow {
  id: string
  text: string
  emoji: string
  base_reactions: ReactionCounts | null
  created_at: string
}

function rowToThought(row: ThoughtRow): Thought {
  const ist = new Date(new Date(row.created_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  return {
    id: row.id,
    text: row.text,
    emoji: row.emoji || '💭',
    ...istDateParts(ist),
    baseReactions: row.base_reactions ?? {},
  }
}

/** Approved thoughts, newest first. Returns null when unconfigured or unreachable. */
export async function fetchApprovedThoughts(): Promise<Thought[] | null> {
  if (!isConfigured) return null
  try {
    const rows = await rest<ThoughtRow[]>(
      '/rest/v1/thoughts?status=eq.approved&select=id,text,emoji,base_reactions,created_at&order=created_at.desc&limit=40',
    )
    return rows.map(rowToThought)
  } catch {
    return null
  }
}

/** Aggregated live reaction counts, keyed by thought id. Null when unavailable. */
export async function fetchReactionCounts(): Promise<Record<string, ReactionCounts> | null> {
  if (!isConfigured) return null
  try {
    const rows = await rest<{ thought_id: string; kind: StampKey; count: number }[]>(
      '/rest/v1/reaction_counts?select=thought_id,kind,count',
    )
    const out: Record<string, ReactionCounts> = {}
    for (const r of rows) (out[r.thought_id] ??= {})[r.kind] = r.count
    return out
  } catch {
    return null
  }
}

/** New thoughts land as pending — read by Vikas before they go up.
    Resolves true when the note reached the server, false when it couldn't
    (the caller stays optimistic either way; only the toast copy changes). */
export function submitThought(text: string, emoji: string): Promise<boolean> {
  if (!isConfigured) return Promise.resolve(false)
  return rest('/rest/v1/thoughts', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ text, emoji }),
  }).then(
    () => true,
    () => false,
  )
}

/** One reaction per type per visitor, toggled atomically server-side. Fire-and-forget. */
export function toggleReactionRemote(thoughtId: string, kind: StampKey, visitorId: string): void {
  if (!isConfigured) return
  if (thoughtId.startsWith('local-')) return // optimistic notes aren't on the server yet
  void rest('/rest/v1/rpc/toggle_reaction', {
    method: 'POST',
    body: JSON.stringify({ p_thought: thoughtId, p_kind: kind, p_visitor: visitorId }),
  }).catch(() => {})
}
