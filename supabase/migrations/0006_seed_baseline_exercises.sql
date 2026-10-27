-- Baseline exercises every account starts with -- common movements found in
-- nearly any gym, so a brand-new catalog isn't empty on first use. These are
-- plain, uncategorized catalog rows: no different from anything a user adds
-- themselves, and freely renamed/removed afterward (see DEVLOG.md).
--
-- Seeded two ways: a trigger on auth.users so every *future* signup gets
-- them automatically, and a one-off backfill for accounts that already
-- exist. `on conflict do nothing` relies on the case-insensitive unique
-- index from 0004, so re-running this migration is always safe.

create or replace function public.seed_baseline_exercises(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.exercises (user_id, name)
  values
    (target_user_id, 'Bench Press'),
    (target_user_id, 'Dumbbell Bench Press'),
    (target_user_id, 'Incline Bench Press'),
    (target_user_id, 'Incline Dumbbell Press'),
    (target_user_id, 'Cable Fly'),
    (target_user_id, 'Push-up'),
    (target_user_id, 'Deadlift'),
    (target_user_id, 'Barbell Row'),
    (target_user_id, 'Dumbbell Row'),
    (target_user_id, 'Lat Pulldown'),
    (target_user_id, 'Pull-up'),
    (target_user_id, 'Seated Cable Row'),
    (target_user_id, 'Overhead Press'),
    (target_user_id, 'Dumbbell Shoulder Press'),
    (target_user_id, 'Dumbbell Lateral Raise'),
    (target_user_id, 'Cable Lateral Raise'),
    (target_user_id, 'Machine Lateral Raise'),
    (target_user_id, 'Front Raise'),
    (target_user_id, 'Face Pull'),
    (target_user_id, 'Back Squat'),
    (target_user_id, 'Front Squat'),
    (target_user_id, 'Romanian Deadlift'),
    (target_user_id, 'Leg Press'),
    (target_user_id, 'Leg Extension'),
    (target_user_id, 'Leg Curl'),
    (target_user_id, 'Dumbbell Lunge'),
    (target_user_id, 'Calf Raise'),
    (target_user_id, 'Barbell Curl'),
    (target_user_id, 'Dumbbell Curl'),
    (target_user_id, 'Hammer Curl'),
    (target_user_id, 'Cable Tricep Pushdown'),
    (target_user_id, 'Overhead Tricep Extension'),
    (target_user_id, 'Skull Crusher'),
    (target_user_id, 'Plank'),
    (target_user_id, 'Hanging Leg Raise'),
    (target_user_id, 'Cable Crunch'),
    (target_user_id, 'Russian Twist')
  on conflict (user_id, lower(name)) do nothing;
end;
$$;

-- security definer is a deliberate exception here, unlike create_workout's
-- security invoker: this fires from an auth.users insert during signup,
-- before there's an authenticated auth.uid() context for RLS to check the
-- new row's user_id against. Standard pattern for "seed data on signup".
create or replace function public.handle_new_user_seed_exercises()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.seed_baseline_exercises(new.id);
  return new;
end;
$$;

create trigger on_auth_user_created_seed_exercises
  after insert on auth.users
  for each row execute function public.handle_new_user_seed_exercises();

-- Backfill for accounts that already exist.
do $$
declare
  existing_user_id uuid;
begin
  for existing_user_id in select id from auth.users loop
    perform public.seed_baseline_exercises(existing_user_id);
  end loop;
end;
$$;
