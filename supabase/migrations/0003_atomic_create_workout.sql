-- saveWorkout() previously did 3 sequential client-side inserts (workout ->
-- workout_exercises -> sets), so a mid-request failure could leave a partial
-- workout. Moving all three into one Postgres function makes them atomic:
-- if anything inside raises, Postgres rolls back the whole function call.
--
-- security invoker (the default) is deliberate: this function runs with the
-- privileges of whoever calls it, so the existing RLS policies and table
-- grants still apply exactly as before -- it does not bypass them.

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
  new_workout_id uuid;
  exercise jsonb;
  new_exercise_id uuid;
  set_row jsonb;
  exercise_position int := 0;
  set_position int;
begin
  insert into public.workouts (started_at, completed_at)
  values (started_at, completed_at)
  returning id into new_workout_id;

  for exercise in select * from jsonb_array_elements(exercises)
  loop
    insert into public.workout_exercises (workout_id, name, position)
    values (new_workout_id, exercise->>'name', exercise_position)
    returning id into new_exercise_id;

    set_position := 0;
    for set_row in select * from jsonb_array_elements(exercise->'sets')
    loop
      insert into public.sets (workout_exercise_id, weight_kg, reps, notes, position)
      values (
        new_exercise_id,
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

revoke execute on function public.create_workout(timestamptz, timestamptz, jsonb) from public;
grant execute on function public.create_workout(timestamptz, timestamptz, jsonb) to authenticated;
