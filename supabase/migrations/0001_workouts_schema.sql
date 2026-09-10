-- TrackMate initial schema: workouts, workout_exercises, sets.
--
-- Exercise names are stored as plain text on workout_exercises rather than
-- a separate exercises table. A reusable/shared exercise catalog is a
-- deliberately deferred decision (see DEVLOG.md) — this schema avoids
-- pre-committing to that design.
--
-- Every table carries its own user_id (denormalized from workouts) so RLS
-- policies are simple equality checks rather than cross-table EXISTS
-- subqueries.

create extension if not exists pgcrypto;

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  started_at timestamptz not null,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercises (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  weight_kg numeric not null,
  reps int not null,
  notes text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index workouts_user_id_idx on public.workouts (user_id);
create index workout_exercises_workout_id_idx on public.workout_exercises (workout_id);
create index sets_workout_exercise_id_idx on public.sets (workout_exercise_id);

alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.sets enable row level security;

create policy "workouts: owner select" on public.workouts
  for select using (auth.uid() = user_id);
create policy "workouts: owner insert" on public.workouts
  for insert with check (auth.uid() = user_id);
create policy "workouts: owner update" on public.workouts
  for update using (auth.uid() = user_id);
create policy "workouts: owner delete" on public.workouts
  for delete using (auth.uid() = user_id);

create policy "workout_exercises: owner select" on public.workout_exercises
  for select using (auth.uid() = user_id);
create policy "workout_exercises: owner insert" on public.workout_exercises
  for insert with check (auth.uid() = user_id);
create policy "workout_exercises: owner update" on public.workout_exercises
  for update using (auth.uid() = user_id);
create policy "workout_exercises: owner delete" on public.workout_exercises
  for delete using (auth.uid() = user_id);

create policy "sets: owner select" on public.sets
  for select using (auth.uid() = user_id);
create policy "sets: owner insert" on public.sets
  for insert with check (auth.uid() = user_id);
create policy "sets: owner update" on public.sets
  for update using (auth.uid() = user_id);
create policy "sets: owner delete" on public.sets
  for delete using (auth.uid() = user_id);
