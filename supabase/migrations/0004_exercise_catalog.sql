-- Exercise catalog, built incrementally from use rather than seeded from an
-- external dataset or a hand-authored list (see DEVLOG.md). Using an
-- exercise during a workout -- whether picked from the catalog or typed as
-- a new name -- is how it joins the catalog; there's no separate "add to
-- catalog" step.
--
-- Case-insensitive uniqueness is enforced here (not just client-side) so a
-- race or a client bug can't still create "Bench Press" and "bench press"
-- as two catalog entries.

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create unique index exercises_user_id_lower_name_idx
  on public.exercises (user_id, lower(name));

alter table public.exercises enable row level security;

create policy "exercises: owner select" on public.exercises
  for select using (auth.uid() = user_id);
create policy "exercises: owner insert" on public.exercises
  for insert with check (auth.uid() = user_id);
create policy "exercises: owner update" on public.exercises
  for update using (auth.uid() = user_id);
create policy "exercises: owner delete" on public.exercises
  for delete using (auth.uid() = user_id);

grant select, insert, update, delete on public.exercises to authenticated;

-- Backfill one catalog entry per distinct (user, case-insensitive name)
-- already present in workout history, then link workout_exercises to it
-- and drop the now-redundant loose name column.
insert into public.exercises (user_id, name)
select distinct on (user_id, lower(name)) user_id, name
from public.workout_exercises
order by user_id, lower(name), created_at;

alter table public.workout_exercises
  add column exercise_id uuid references public.exercises (id) on delete restrict;

update public.workout_exercises we
set exercise_id = e.id
from public.exercises e
where e.user_id = we.user_id and lower(e.name) = lower(we.name);

alter table public.workout_exercises
  alter column exercise_id set not null;

alter table public.workout_exercises
  drop column name;

create index workout_exercises_exercise_id_idx on public.workout_exercises (exercise_id);
