-- Disabling "Automatically expose new tables" (correctly, for manual control)
-- means tables created via SQL are never auto-granted API access — RLS
-- policies alone don't matter without these base table grants, since RLS
-- only filters rows on top of privileges a role already has.

grant usage on schema public to authenticated;

grant select, insert, update, delete on public.workouts to authenticated;
grant select, insert, update, delete on public.workout_exercises to authenticated;
grant select, insert, update, delete on public.sets to authenticated;
