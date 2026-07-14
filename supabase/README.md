# Guestbook backend (Supabase)

The site runs perfectly without this — the guestbook falls back to the six seeded
thoughts and localStorage. Connect Supabase whenever you're ready; no code changes
needed.

## Setup (once)

1. Create a project at [database.new](https://database.new) (free tier is plenty).
2. Open **SQL Editor** → paste and run `migrations/0001_guestbook.sql`.
3. In **Project Settings → API**, copy the *Project URL* and the *anon public* key.
4. Create `.env` in the repo root (see `.env.example`):

   ```
   VITE_SUPABASE_URL=https://<your-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   ```

5. Rebuild/redeploy. Done.

## Moderating thoughts

New submissions land with `status = 'pending'` and are invisible to visitors
("Thoughts are read by everyone before they go up" — that's you).

- Dashboard → **Table Editor** → `thoughts`
- Filter `status = pending`
- Set `status` to `approved` (or `rejected`)

Approved thoughts appear on the wall on the next page load, newest first.

## How the pieces fit

- `thoughts` — text (≤200 chars), emoji, status, seeded `base_reactions`, timestamp.
  Anon may only *read approved* and *insert pending* (enforced by RLS).
- `reactions` — one row per (thought, visitor, kind). The table has **no** anon
  policies: visitor ids are never exposed. Reads go through the `reaction_counts`
  aggregate view; writes through the `toggle_reaction` RPC, which validates the
  kind and that the thought is approved, then atomically inserts/deletes.
- The client (`src/lib/guestbook-api.ts`) talks to PostgREST with plain `fetch` —
  no supabase-js dependency. The UI never waits on network: the deck updates
  optimistically, and only the confirmation toast follows the write's result.

## Later (optional)

- **Realtime live-wall**: the "someone just left a thought" toast is reserved
  for a real approval event. Subscribing to `thoughts` via Supabase Realtime
  would light it up without touching the UI.

## If the guestbook is ever abused

Moderation already contains the damage — nothing appears on the wall without
approval, and reactions only attach to approved thoughts. If it becomes a
nuisance anyway, the levers (in escalating order):

1. **Pending-queue spam**: a small `submission_log(ip, at)` table written by a
   `before insert` trigger on `thoughts`, rejecting more than N inserts per IP
   per hour — no client changes.
2. **Reaction-count inflation** (the RPC trusts a client-generated visitor
   uuid): same throttle idea on `toggle_reaction`, or cap distinct visitors
   counted per thought per day.
3. **Both, properly**: move writes behind a Supabase Edge Function that
   rate-limits and (if it ever comes to that) adds a CAPTCHA. The client's
   `rest()` helper only needs a different path.
