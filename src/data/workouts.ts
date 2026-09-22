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
  const { error } = await supabase.rpc('create_workout', {
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
  });
  if (error) throw error;
}
