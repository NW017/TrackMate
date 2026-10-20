import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Workout } from '../types/workout';

const draftKey = (userId: string) => `@trackmate/draft-workout/${userId}`;

// Resuming a draft started on a different calendar day isn't realistic use
// for a gym session, and doubles as cleanup for anything abandoned long ago.
export function isDraftStale(startedAt: string, now: Date = new Date()): boolean {
  const started = new Date(startedAt);
  return (
    started.getFullYear() !== now.getFullYear() ||
    started.getMonth() !== now.getMonth() ||
    started.getDate() !== now.getDate()
  );
}

export async function getDraftWorkout(userId: string): Promise<Workout | null> {
  const stored = await AsyncStorage.getItem(draftKey(userId));
  if (!stored) return null;

  const workout = JSON.parse(stored) as Workout;
  if (isDraftStale(workout.startedAt)) {
    await AsyncStorage.removeItem(draftKey(userId));
    return null;
  }
  return workout;
}

export async function saveDraftWorkout(userId: string, workout: Workout): Promise<void> {
  await AsyncStorage.setItem(draftKey(userId), JSON.stringify(workout));
}

export async function clearDraftWorkout(userId: string): Promise<void> {
  await AsyncStorage.removeItem(draftKey(userId));
}
