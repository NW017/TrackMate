import { supabase } from './supabaseClient';
import type { Workout } from '../types/workout';

type SetRow = {
  id: string;
  weight_kg: number;
  reps: number;
  notes: string;
  position: number;
};

type WorkoutExerciseRow = {
  id: string;
  name: string;
  position: number;
  sets: SetRow[];
};

type WorkoutRow = {
  id: string;
  started_at: string;
  completed_at: string | null;
  workout_exercises: WorkoutExerciseRow[];
};

export async function getWorkouts(): Promise<Workout[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select(
      'id, started_at, completed_at, workout_exercises(id, name, position, sets(id, weight_kg, reps, notes, position))',
    )
    .order('completed_at', { ascending: false });
  if (error) throw error;

  return ((data ?? []) as WorkoutRow[]).map((workout) => ({
    id: workout.id,
    startedAt: workout.started_at,
    completedAt: workout.completed_at ?? '',
    exercises: [...workout.workout_exercises]
      .sort((a, b) => a.position - b.position)
      .map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        sets: [...exercise.sets]
          .sort((a, b) => a.position - b.position)
          .map((set) => ({
            id: set.id,
            weightKg: Number(set.weight_kg),
            reps: set.reps,
            notes: set.notes,
          })),
      })),
  }));
}

export async function saveWorkout(workout: Workout): Promise<void> {
  const { data: workoutRow, error: workoutError } = await supabase
    .from('workouts')
    .insert({ started_at: workout.startedAt, completed_at: workout.completedAt || null })
    .select('id')
    .single();
  if (workoutError) throw workoutError;

  for (const [exerciseIndex, exercise] of workout.exercises.entries()) {
    const { data: exerciseRow, error: exerciseError } = await supabase
      .from('workout_exercises')
      .insert({ workout_id: workoutRow.id, name: exercise.name, position: exerciseIndex })
      .select('id')
      .single();
    if (exerciseError) throw exerciseError;

    if (exercise.sets.length === 0) continue;

    const { error: setsError } = await supabase.from('sets').insert(
      exercise.sets.map((set, setIndex) => ({
        workout_exercise_id: exerciseRow.id,
        weight_kg: set.weightKg,
        reps: set.reps,
        notes: set.notes,
        position: setIndex,
      })),
    );
    if (setsError) throw setsError;
  }
}
