export type Exercise = {
  id: string;
  name: string;
};

export type SetEntry = {
  id: string;
  weightKg: number;
  reps: number;
  notes: string;
};

export type WorkoutExercise = Exercise & {
  sets: SetEntry[];
};

export type Workout = {
  id: string;
  startedAt: string;
  completedAt: string;
  exercises: WorkoutExercise[];
};

export const seededExercises: Exercise[] = [
  { id: 'bench-press', name: 'Bench Press' },
  { id: 'back-squat', name: 'Back Squat' },
  { id: 'deadlift', name: 'Deadlift' },
  { id: 'overhead-press', name: 'Overhead Press' },
  { id: 'pull-up', name: 'Pull-up' },
  { id: 'barbell-row', name: 'Barbell Row' },
];
