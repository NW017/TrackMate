import type { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text } from 'react-native';

import { getSession, onAuthStateChange, signOut } from './src/data/auth';
import { getWorkouts, saveWorkout } from './src/data/workouts';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutScreen } from './src/screens/WorkoutScreen';
import { colors } from './src/theme/colors';
import type { Workout } from './src/types/workout';

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [screen, setScreen] = useState<'home' | 'history'>('home');

  const refreshWorkouts = useCallback(() => {
    getWorkouts()
      .then(setWorkouts)
      .catch(() => Alert.alert('Could not load workouts', 'Check your connection and try again.'));
  }, []);

  const handleSessionChange = useCallback(
    (nextSession: Session | null) => {
      setSession(nextSession);
      if (nextSession) {
        refreshWorkouts();
      } else {
        setWorkouts(null);
        setActiveWorkout(null);
      }
    },
    [refreshWorkouts],
  );

  useEffect(() => {
    getSession()
      .then(handleSessionChange)
      .catch(() => setSession(null));
    return onAuthStateChange(handleSessionChange);
  }, [handleSessionChange]);

  const finishWorkout = async (workout: Workout) => {
    const completedWorkout = { ...workout, completedAt: new Date().toISOString() };
    setActiveWorkout(null);
    setScreen('history');
    try {
      await saveWorkout(completedWorkout);
      refreshWorkouts();
    } catch {
      Alert.alert(
        'Could not save workout',
        'Your workout may not have been saved. Please try again.',
      );
    }
  };

  const handleSignOut = () => {
    signOut().catch(() => Alert.alert('Could not sign out', 'Please try again.'));
  };

  if (session === undefined) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loading}>Loading TrackMate...</Text>
      </SafeAreaView>
    );
  }

  if (!session) {
    return <AuthScreen />;
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

  if (workouts === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loading}>Loading your workouts...</Text>
      </SafeAreaView>
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
      onSignOut={handleSignOut}
    />
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loading: { color: colors.text, padding: 24 },
});
