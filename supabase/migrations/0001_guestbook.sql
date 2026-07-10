-- Guestbook: thoughts + reactions with a moderation queue.
-- Anonymous visitors can read approved thoughts, leave pending ones, and toggle
-- reactions through a validated RPC. Moderation happens in the Supabase dashboard
-- (Table Editor → thoughts → flip status to 'approved').

create table public.thoughts (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) between 1 and 200),
  emoji text not null default '💭' check (char_length(emoji) <= 8),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  -- seeded/display-only counts the live reaction counts sit on top of
  base_reactions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index thoughts_approved_idx on public.thoughts (created_at desc) where status = 'approved';

alter table public.thoughts enable row level security;

create policy "anyone can read approved thoughts"
  on public.thoughts for select
  using (status = 'approved');

create policy "anyone can leave a pending thought"
  on public.thoughts for insert
  with check (status = 'pending');

-- One reaction per (thought, visitor, kind). No direct grants: reads happen via the
-- aggregate view below (visitor ids stay private) and writes via the RPC.
create table public.reactions (
  thought_id uuid not null references public.thoughts (id) on delete cascade,
  visitor_id uuid not null,
  kind text not null check (kind in ('rock_on', 'lightbulb', 'coffee', 'doodle')),
  created_at timestamptz not null default now(),
  primary key (thought_id, visitor_id, kind)
);

alter table public.reactions enable row level security;
-- no policies: the anon role can never touch rows directly

create view public.reaction_counts
with (security_invoker = off) as
select thought_id, kind, count(*)::int as count
from public.reactions
group by thought_id, kind;

grant select on public.reaction_counts to anon;

-- Atomic toggle, validated server-side: the thought must be approved, the kind real.
create or replace function public.toggle_reaction(p_thought uuid, p_kind text, p_visitor uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  if p_kind not in ('rock_on', 'lightbulb', 'coffee', 'doodle') then
    raise exception 'unknown reaction kind';
  end if;
  if not exists (select 1 from thoughts where id = p_thought and status = 'approved') then
    raise exception 'thought not found';
  end if;

  delete from reactions where thought_id = p_thought and visitor_id = p_visitor and kind = p_kind;
  if not found then
    insert into reactions (thought_id, visitor_id, kind) values (p_thought, p_visitor, p_kind);
  end if;

  select count(*) into n from reactions where thought_id = p_thought and kind = p_kind;
  return n;
end;
$$;

grant execute on function public.toggle_reaction(uuid, text, uuid) to anon;

-- The six designed seed thoughts (fixed uuids — the client's offline fallback uses
-- the same ids, so per-visitor reaction state carries over once connected).
insert into public.thoughts (id, text, emoji, status, base_reactions, created_at) values
  ('5eed0000-0000-4000-8000-000000000001', 'You can tell a lot about a tool by how it treats you when you make a mistake.', '🤘', 'approved', '{"rock_on": 12, "lightbulb": 5, "coffee": 8, "doodle": 3}', '2026-07-22T09:30:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000002', 'I learned to care about a foam pattern on a wave nobody would ever see.', '🌊', 'approved', '{"rock_on": 2, "lightbulb": 4, "coffee": 6, "doodle": 9}', '2026-07-18T09:30:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000003', 'Desire paths are the ground quietly disagreeing with the architect.', '🌱', 'approved', '{"rock_on": 4, "lightbulb": 11, "coffee": 3, "doodle": 5}', '2026-07-15T09:30:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000004', 'Airlines board planes in the slowest possible order and everyone just accepts it.', '✈️', 'approved', '{"rock_on": 7, "lightbulb": 2, "coffee": 5, "doodle": 1}', '2026-07-11T09:30:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000005', 'The queue always feels faster when you can see it moving.', '🤔', 'approved', '{"rock_on": 1, "lightbulb": 3, "coffee": 4, "doodle": 2}', '2026-07-07T09:30:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000006', 'A good checkout flow is one you can''t remember afterwards.', '✨', 'approved', '{"rock_on": 3, "lightbulb": 6, "coffee": 10, "doodle": 4}', '2026-07-03T09:30:00+05:30');
