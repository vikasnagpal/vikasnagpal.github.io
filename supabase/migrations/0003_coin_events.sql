-- Coin discovery telemetry: one anonymous row per lifetime-first coin catch.
-- Answers a single question: are visitors finding the easter egg at all?
-- No visitor ids, no device info, no coordinates — an event name and a moment.

create table public.coin_events (
  id uuid primary key default gen_random_uuid(),
  event text not null check (event in ('first_coin')),
  created_at timestamptz not null default now()
);

alter table public.coin_events enable row level security;

create policy "anyone can report a discovery"
  on public.coin_events for insert
  with check (event = 'first_coin');

-- no select policy: visitors can never read the tally; Vikas reads it in the
-- dashboard (Table Editor / SQL editor run as service role)
