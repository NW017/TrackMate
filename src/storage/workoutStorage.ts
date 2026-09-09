import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Workout } from '../types/workout';

const STORAGE_KEY = '@trackmate/workouts';

export async function loadWorkouts(): Promise<Workout[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as Workout[]) : [];
}

export async function saveWorkouts(workouts: Workout[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}
