export type SetEntry = {
  id: string;
  weightKg: number;
  reps: number;
  notes: string;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: SetEntry[];
};

export type Workout = {
  id: string;
  startedAt: string;
  completedAt: string;
  exercises: WorkoutExercise[];
};
