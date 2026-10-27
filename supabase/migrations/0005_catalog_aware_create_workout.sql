-- Extends create_workout to resolve-or-create each exercise against the
-- user's catalog (added in 0004) inside the same atomic transaction, rather
-- than the client doing a separate round-trip first. Matching is
-- case-insensitive so "Bench Press" and "bench press" resolve to the same
-- catalog entry instead of creating a near-duplicate.

create or replace function public.create_workout(
  started_at timestamptz,
  completed_at timestamptz,
  exercises jsonb
)
returns uuid
language plpgsql
security invoker
as $$
declare
  current_user_id uuid := auth.uid();
  new_workout_id uuid;
  exercise jsonb;
  exercise_name text;
  resolved_exercise_id uuid;
  new_workout_exercise_id uuid;
  set_row jsonb;
  exercise_position int := 0;
  set_position int;
begin
  insert into public.workouts (started_at, completed_at)
  values (started_at, completed_at)
  returning id into new_workout_id;

  for exercise in select * from jsonb_array_elements(exercises)
  loop
    exercise_name := exercise->>'name';

    select id into resolved_exercise_id
    from public.exercises
    where user_id = current_user_id and lower(name) = lower(exercise_name);

    if resolved_exercise_id is null then
      insert into public.exercises (user_id, name)
      values (current_user_id, exercise_name)
      returning id into resolved_exercise_id;
    end if;

    insert into public.workout_exercises (workout_id, exercise_id, position)
    values (new_workout_id, resolved_exercise_id, exercise_position)
    returning id into new_workout_exercise_id;

    set_position := 0;
    for set_row in select * from jsonb_array_elements(exercise->'sets')
    loop
      insert into public.sets (workout_exercise_id, weight_kg, reps, notes, position)
      values (
        new_workout_exercise_id,
        (set_row->>'weightKg')::numeric,
        (set_row->>'reps')::int,
        coalesce(set_row->>'notes', ''),
        set_position
      );
      set_position := set_position + 1;
    end loop;

    exercise_position := exercise_position + 1;
  end loop;

  return new_workout_id;
end;
$$;
