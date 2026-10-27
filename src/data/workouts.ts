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
  position: number;
  exercises: { name: string } | null;
  sets: SetRow[];
};

type WorkoutRow = {
  id: string;
  started_at: string;
  completed_at: string | null;
  workout_exercises: WorkoutExerciseRow[];
};

export function mapWorkoutRow(workout: WorkoutRow): Workout {
  return {
    id: workout.id,
    startedAt: workout.started_at,
    completedAt: workout.completed_at ?? '',
    exercises: [...workout.workout_exercises]
      .sort((a, b) => a.position - b.position)
      .map((exercise) => ({
        id: exercise.id,
        name: exercise.exercises?.name ?? '',
        sets: [...exercise.sets]
          .sort((a, b) => a.position - b.position)
          .map((set) => ({
            id: set.id,
            weightKg: Number(set.weight_kg),
            reps: set.reps,
            notes: set.notes,
          })),
      })),
  };
}

export async function getWorkouts(): Promise<Workout[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select(
      'id, started_at, completed_at, workout_exercises(id, position, exercises(name), sets(id, weight_kg, reps, notes, position))',
    )
    .order('completed_at', { ascending: false });
  if (error) throw error;

  return ((data ?? []) as unknown as WorkoutRow[]).map(mapWorkoutRow);
}

type CreateWorkoutPayload = {
  started_at: string;
  completed_at: string | null;
  exercises: { name: string; sets: { weightKg: number; reps: number; notes: string }[] }[];
};

export function buildCreateWorkoutPayload(workout: Workout): CreateWorkoutPayload {
  return {
    started_at: workout.startedAt,
    completed_at: workout.completedAt || null,
    exercises: workout.exercises.map((exercise) => ({
      name: exercise.name,
      sets: exercise.sets.map((set) => ({
        weightKg: set.weightKg,
        reps: set.reps,
        notes: set.notes,
      })),
    })),
  };
}

export async function saveWorkout(workout: Workout): Promise<void> {
  const { error } = await supabase.rpc('create_workout', buildCreateWorkoutPayload(workout));
  if (error) throw error;
}

export async function updateSet(
  setId: string,
  changes: { weightKg: number; reps: number; notes: string },
): Promise<void> {
  const { error } = await supabase
    .from('sets')
    .update({ weight_kg: changes.weightKg, reps: changes.reps, notes: changes.notes })
    .eq('id', setId);
  if (error) throw error;
}

export async function deleteSet(setId: string): Promise<void> {
  const { error } = await supabase.from('sets').delete().eq('id', setId);
  if (error) throw error;
}

export async function deleteWorkoutExercise(exerciseId: string): Promise<void> {
  const { error } = await supabase.from('workout_exercises').delete().eq('id', exerciseId);
  if (error) throw error;
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  const { error } = await supabase.from('workouts').delete().eq('id', workoutId);
  if (error) throw error;
}

export async function getExerciseCatalog(): Promise<{ id: string; name: string }[]> {
  const { data, error } = await supabase.from('exercises').select('id, name').order('name');
  if (error) throw error;
  return data ?? [];
}
