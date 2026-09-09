import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text } from 'react-native';

import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutScreen } from './src/screens/WorkoutScreen';
import { loadWorkouts, saveWorkouts } from './src/storage/workoutStorage';
import { colors } from './src/theme/colors';
import type { Workout } from './src/types/workout';

export default function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [screen, setScreen] = useState<'home' | 'history'>('home');

  useEffect(() => {
    loadWorkouts()
      .then(setWorkouts)
      .catch(() =>
        Alert.alert('Could not load workouts', 'Your saved workouts could not be loaded.'),
      )
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveWorkouts(workouts).catch(() =>
        Alert.alert('Could not save workout', 'Your latest changes may not persist.'),
      );
    }
  }, [isLoaded, workouts]);

  const finishWorkout = (workout: Workout) => {
    const completedWorkout = { ...workout, completedAt: new Date().toISOString() };
    setWorkouts((current) => [completedWorkout, ...current]);
    setActiveWorkout(null);
    setScreen('history');
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loading}>Loading TrackMate...</Text>
      </SafeAreaView>
    );
  }

  if (activeWorkout) {
    return (
      <WorkoutScreen
        workout={activeWorkout}
        onChange={setActiveWorkout}
        onFinish={() => finishWorkout(activeWorkout)}
        onCancel={() => setActiveWorkout(null)}
      />
    );
  }

  return (
    <HomeScreen
      workouts={workouts}
      screen={screen}
      onStartWorkout={() =>
        setActiveWorkout({
          id: `workout-${Date.now()}`,
          startedAt: new Date().toISOString(),
          completedAt: '',
          exercises: [],
        })
      }
      onViewHistory={() => setScreen('history')}
    />
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loading: { color: colors.text, padding: 24 },
});
