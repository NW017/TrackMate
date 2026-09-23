import { buildCreateWorkoutPayload, mapWorkoutRow } from './workouts';

describe('mapWorkoutRow', () => {
  it('maps a workout row and sorts exercises and sets by position', () => {
    const workout = mapWorkoutRow({
      id: 'workout-1',
      started_at: '2026-09-10T10:00:00.000Z',
      completed_at: '2026-09-10T10:45:00.000Z',
      workout_exercises: [
        {
          id: 'exercise-2',
          name: 'Back Squat',
          position: 1,
          sets: [
            { id: 'set-2', weight_kg: 100, reps: 5, notes: '', position: 1 },
            { id: 'set-1', weight_kg: 80, reps: 8, notes: 'warm-up', position: 0 },
          ],
        },
        {
          id: 'exercise-1',
          name: 'Bench Press',
          position: 0,
          sets: [],
        },
      ],
    });

    expect(workout.exercises.map((exercise) => exercise.name)).toEqual([
      'Bench Press',
      'Back Squat',
    ]);
    expect(workout.exercises[1].sets.map((set) => set.id)).toEqual(['set-1', 'set-2']);
  });

  it('treats a null completed_at as an in-progress-looking empty string', () => {
    const workout = mapWorkoutRow({
      id: 'workout-1',
      started_at: '2026-09-10T10:00:00.000Z',
      completed_at: null,
      workout_exercises: [],
    });

    expect(workout.completedAt).toBe('');
  });

  it('coerces weight_kg to a number even if the database returns it as a string', () => {
    const workout = mapWorkoutRow({
      id: 'workout-1',
      started_at: '2026-09-10T10:00:00.000Z',
      completed_at: null,
      workout_exercises: [
        {
          id: 'exercise-1',
          name: 'Deadlift',
          position: 0,
          sets: [
            {
              id: 'set-1',
              weight_kg: '140.5' as unknown as number,
              reps: 3,
              notes: '',
              position: 0,
            },
          ],
        },
      ],
    });

    expect(workout.exercises[0].sets[0].weightKg).toBe(140.5);
  });
});

describe('buildCreateWorkoutPayload', () => {
  it('converts an empty completedAt into null for the database', () => {
    const payload = buildCreateWorkoutPayload({
      id: 'local-id',
      startedAt: '2026-09-10T10:00:00.000Z',
      completedAt: '',
      exercises: [],
    });

    expect(payload.completed_at).toBeNull();
  });

  it('flattens exercises and sets into the RPC shape', () => {
    const payload = buildCreateWorkoutPayload({
      id: 'local-id',
      startedAt: '2026-09-10T10:00:00.000Z',
      completedAt: '2026-09-10T10:45:00.000Z',
      exercises: [
        {
          id: 'exercise-1',
          name: 'Overhead Press',
          sets: [{ id: 'set-1', weightKg: 40, reps: 6, notes: 'felt heavy' }],
        },
      ],
    });

    expect(payload.exercises).toEqual([
      {
        name: 'Overhead Press',
        sets: [{ weightKg: 40, reps: 6, notes: 'felt heavy' }],
      },
    ]);
  });
});
