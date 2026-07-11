-- Replace the seed thoughts with Vikas' curated notes (2026-07-11).
-- Deleting from thoughts cascades into reactions (visitor reaction rows on the
-- old cards go with them). Ids stay fixed and match src/lib/seeds.ts so the
-- client's instant-paint fallback lines up with the server.
-- Run this whole file in the Supabase SQL Editor.

delete from public.thoughts;

insert into public.thoughts (id, text, emoji, status, base_reactions, created_at) values
  ('5eed0000-0000-4000-8000-000000000001', 'Life moves pretty fast. If you don''t stop and look around once in a while, you could miss it.', '😄', 'approved', '{"rock_on": 9, "lightbulb": 5, "coffee": 7, "doodle": 4}', '2026-07-09T08:14:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000002', 'what you take, owns you. What you give, sets you free', '💛', 'approved', '{"rock_on": 4, "lightbulb": 6, "coffee": 5, "doodle": 10}', '2026-07-04T21:47:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000003', 'Never attribute to malice that which is adequately explained by incompetence', '🤔', 'approved', '{"rock_on": 7, "lightbulb": 9, "coffee": 3, "doodle": 5}', '2026-06-26T16:05:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000004', 'Curiosity without a means to satisfy it is frustrating.', '📚', 'approved', '{"rock_on": 5, "lightbulb": 8, "coffee": 6, "doodle": 3}', '2026-06-19T11:32:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000005', 'kyu darein ke zindagi me kya hoga, kuch na hoga toh tajurba hoga', '✌️', 'approved', '{"rock_on": 10, "lightbulb": 4, "coffee": 7, "doodle": 6}', '2026-06-16T23:18:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000006', 'a moving man surely meets his luck, the road favours the traveller', '🌿', 'approved', '{"rock_on": 8, "lightbulb": 3, "coffee": 5, "doodle": 7}', '2026-06-07T09:51:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000007', 'We only get to sample a small taste of everything life has to offer, but in choosing deliberately, we are doing the most important job we were brought here to do', '☕', 'approved', '{"rock_on": 6, "lightbulb": 10, "coffee": 4, "doodle": 8}', '2026-06-01T18:26:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000008', 'You already know what to do, you are just negotiating with comfort', '🎧', 'approved', '{"rock_on": 7, "lightbulb": 6, "coffee": 9, "doodle": 3}', '2026-05-28T14:09:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000009', 'You can tell a lot about a tool by how it treats you when you make a mistake.', '🌸', 'approved', '{"rock_on": 9, "lightbulb": 5, "coffee": 8, "doodle": 4}', '2026-05-20T20:33:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000010', 'Desire paths are the ground quietly disagreeing with the architect.', '🌱', 'approved', '{"rock_on": 5, "lightbulb": 9, "coffee": 4, "doodle": 6}', '2026-05-16T10:44:00+05:30'),
  ('5eed0000-0000-4000-8000-000000000011', 'The queue always feels faster when you can see it moving.', '🤔', 'approved', '{"rock_on": 3, "lightbulb": 6, "coffee": 7, "doodle": 5}', '2026-05-12T17:21:00+05:30');
