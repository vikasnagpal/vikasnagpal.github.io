import { useCallback, useEffect, useRef, useState } from 'react'
import { SEEDS, type ReactionCounts, type StampKey, type Thought } from '../../lib/seeds'
import { fetchApprovedThoughts, fetchReactionCounts, isConfigured, submitThought, toggleReactionRemote } from '../../lib/guestbook-api'
import { istDateParts } from '../../lib/ist'
import { KEYS, readJSON, writeJSON } from '../../lib/storage'
import { getVisitorId } from '../../lib/visitor'
import { DECK, REACTION, TOAST } from '../../motion/tokens'
import { useAtmosphere } from '../atmosphere/atmosphere'
import { deckOrder } from './paper'
import { useToast } from '../toast/Toast'

export type Phase = 'idle' | 'lift' | 'settle'
export type Mode = 'read' | 'write'

type MineMap = Record<string, Partial<Record<StampKey, boolean>>>

export interface GuestbookApi {
  thoughts: Thought[]
  order: string[]
  phase: Phase
  lastFlown: string | null
  mode: Mode
  draft: string
  guard: boolean
  submitting: boolean
  closing: boolean
  noteEmoji: string | null
  emojiOpen: boolean
  justAdded: string | null
  entered: boolean
  peek: boolean
  breath: boolean
  mine: MineMap
  pressedId: string | null
  pressSeq: number
  countFor: (t: Thought, key: StampKey) => number
  shuffle: () => void
  setPeek: (on: boolean) => void
  startWrite: () => void
  cancelWrite: () => void
  setDraft: (v: string) => void
  setNoteEmoji: (e: string | null) => void
  setEmojiOpen: (open: boolean | ((o: boolean) => boolean)) => void
  submit: () => void
  toggleReaction: (id: string, key: StampKey) => void
}

/* The deck's state machine, ported from the DC's single class: order is an array of
   thought ids (front first); shuffle runs lift → reorder → settle on timeouts paced
   by the atmosphere. Data starts from the bundled seeds and quietly upgrades to
   Supabase when configured — the deck never waits on network. */

export function useGuestbook(): GuestbookApi {
  const { pace } = useAtmosphere()
  const toast = useToast()

  const [thoughts, setThoughts] = useState<Thought[]>(SEEDS)
  const [order, setOrder] = useState<string[]>(() => deckOrder(SEEDS.map((s) => s.id)))
  const [phase, setPhase] = useState<Phase>('idle')
  const [lastFlown, setLastFlown] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('read')
  const [draft, setDraftState] = useState('')
  const [guard, setGuard] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [closing, setClosing] = useState(false)
  const [noteEmoji, setNoteEmoji] = useState<string | null>(null)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [entered, setEntered] = useState(false)
  const [peek, setPeek] = useState(false)
  const [breath, setBreath] = useState(false)
  const [mine, setMine] = useState<MineMap>(() => readJSON<MineMap>(KEYS.reactions, {}))
  const [pressedId, setPressedId] = useState<string | null>(null)
  const [pressSeq, setPressSeq] = useState(0)
  const [serverCounts, setServerCounts] = useState<Record<string, ReactionCounts>>({})

  // Mirrors for imperative reads inside timeouts/handlers (state updaters stay pure).
  const paceRef = useRef(pace)
  paceRef.current = pace
  const mineRef = useRef(mine)
  mineRef.current = mine
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const modeRef = useRef(mode)
  modeRef.current = mode
  const orderRef = useRef(order)
  orderRef.current = order
  const draftRef = useRef(draft)
  draftRef.current = draft
  const emojiRef = useRef(noteEmoji)
  emojiRef.current = noteEmoji
  const submittingRef = useRef(false)

  const mineAtSync = useRef<MineMap>({})
  const interacted = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  // Settle-in and ambient breathing. (The "someone just left a thought" toast is
  // reserved for the real thing — a Supabase Realtime approval event, never a timer.)
  useEffect(() => {
    const tEnter = setTimeout(() => setEntered(true), DECK.enterDelayMs)
    const iBreath = setInterval(() => setBreath((b) => !b), DECK.breathEveryMs)
    const pending = timers.current
    return () => {
      clearTimeout(tEnter)
      clearInterval(iBreath)
      pending.forEach(clearTimeout)
    }
  }, [])

  // Quiet upgrade to the real guestbook. Skipped if the visitor already started
  // playing with the deck — seeds and server agree on content anyway.
  useEffect(() => {
    if (!isConfigured) return
    let alive = true
    void Promise.all([fetchApprovedThoughts(), fetchReactionCounts()]).then(([th, counts]) => {
      if (!alive) return
      if (th && th.length && !interacted.current) {
        setThoughts((prev) => [...prev.filter((t) => t.own), ...th])
        // Keep the on-screen shuffle for ids the seeds already cover (no visible
        // re-deal a beat after paint); genuinely new server notes join the back.
        setOrder((prev) => {
          const server = new Set(th.map((t) => t.id))
          const kept = prev.filter((id) => id.startsWith('local-') || server.has(id))
          const seen = new Set(kept)
          return [...kept, ...deckOrder(th.map((t) => t.id).filter((id) => !seen.has(id)))]
        })
      }
      if (counts) {
        mineAtSync.current = JSON.parse(JSON.stringify(mineRef.current)) as MineMap
        setServerCounts(counts)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  const shuffle = useCallback(() => {
    if (phaseRef.current !== 'idle' || modeRef.current !== 'read') return
    interacted.current = true
    setLastFlown(orderRef.current[0])
    setPhase('lift')
    later(() => {
      setOrder((o) => [...o.slice(1), o[0]])
      setPhase('settle')
      later(() => {
        setPhase('idle')
        setLastFlown(null)
      }, DECK.settle * 1000 * paceRef.current)
    }, DECK.lift * 1000 * paceRef.current)
  }, [later])

  const startWrite = useCallback(() => {
    interacted.current = true
    setMode('write')
    setGuard(false)
  }, [])

  const cancelWrite = useCallback(() => {
    setClosing(true)
    setEmojiOpen(false)
    later(() => {
      setMode('read')
      setClosing(false)
      setDraftState('')
      setGuard(false)
      setNoteEmoji(null)
    }, 150)
  }, [later])

  const addNote = useCallback(() => {
    const text = draftRef.current.trim()
    submittingRef.current = false
    if (!text) return
    const note: Thought = {
      id: `local-${Date.now()}`,
      text,
      emoji: emojiRef.current || '💭',
      ...istDateParts(),
      baseReactions: {},
      own: true,
    }
    submitThought(note.text, note.emoji)
    setThoughts((prev) => [note, ...prev])
    setOrder((prev) => [note.id, ...prev])
    setJustAdded(note.id)
    setMode('read')
    setDraftState('')
    setNoteEmoji(null)
    setGuard(false)
    setSubmitting(false)
    setClosing(false)
    toast("Thanks! Your thought has been added. It'll appear on the wall shortly.", TOAST.submitForMs)
    later(() => setJustAdded(null), DECK.noteFlagClearMs)
  }, [later, toast])

  const submit = useCallback(() => {
    if (submittingRef.current) return
    if (!draftRef.current.trim()) {
      setGuard(true)
      return
    }
    submittingRef.current = true
    setSubmitting(true)
    setEmojiOpen(false)
    later(addNote, 450)
  }, [later, addNote])

  const toggleReaction = useCallback(
    (id: string, key: StampKey) => {
      interacted.current = true
      setPressSeq((s) => s + 1)
      setPressedId(`${id}:${key}`)
      // The count updates deliberately AFTER the press — stamp first, then the ledger.
      later(() => {
        setMine((prev) => {
          const set = { ...(prev[id] ?? {}) }
          if (set[key]) delete set[key]
          else set[key] = true
          const next = { ...prev, [id]: set }
          writeJSON(KEYS.reactions, next)
          return next
        })
        toggleReactionRemote(id, key, getVisitorId())
      }, REACTION.countDelay * 1000)
    },
    [later],
  )

  const countFor = useCallback(
    (t: Thought, key: StampKey): number => {
      const base = t.baseReactions[key] || 0
      const server = serverCounts[t.id]?.[key] || 0
      const now = mine[t.id]?.[key] ? 1 : 0
      const atSync = mineAtSync.current[t.id]?.[key] ? 1 : 0
      return base + server + now - atSync
    },
    [serverCounts, mine],
  )

  const setDraft = useCallback((v: string) => {
    setDraftState(v.slice(0, 200))
    setGuard(false)
  }, [])

  return {
    thoughts,
    order,
    phase,
    lastFlown,
    mode,
    draft,
    guard,
    submitting,
    closing,
    noteEmoji,
    emojiOpen,
    justAdded,
    entered,
    peek,
    breath,
    mine,
    pressedId,
    pressSeq,
    countFor,
    shuffle,
    setPeek,
    startWrite,
    cancelWrite,
    setDraft,
    setNoteEmoji,
    setEmojiOpen,
    submit,
    toggleReaction,
  }
}
