import type { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getSession, onAuthStateChange, signOut } from './src/data/auth';
import { clearDraftWorkout, getDraftWorkout, saveDraftWorkout } from './src/data/draftWorkout';
import { getWorkouts, saveWorkout } from './src/features/workout/workouts';
import { WorkoutDetailScreen } from './src/features/workout/WorkoutDetailScreen';
import { WorkoutScreen } from './src/features/workout/WorkoutScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { colors } from './src/theme/colors';
import type { Workout } from './src/types/workout';

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [viewingWorkout, setViewingWorkout] = useState<Workout | null>(null);
  const [screen, setScreen] = useState<'home' | 'history'>('home');

  const refreshWorkouts = useCallback(() => {
    getWorkouts()
      .then(setWorkouts)
      .catch((error) => {
        console.error('Failed to load workouts', error);
        Alert.alert('Could not load workouts', 'Check your connection and try again.');
        setWorkouts((current) => current ?? []);
      });
  }, []);

  const handleSessionChange = useCallback(
    (nextSession: Session | null) => {
      setSession(nextSession);
      if (nextSession) {
        refreshWorkouts();
        getDraftWorkout(nextSession.user.id)
          .then((draft) => {
            if (draft) setActiveWorkout(draft);
          })
          .catch((error) => console.error('Failed to load draft workout', error));
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

  useEffect(() => {
    if (!session) return;
    if (activeWorkout) {
      saveDraftWorkout(session.user.id, activeWorkout).catch((error) =>
        console.error('Failed to save draft workout', error),
      );
    } else {
      clearDraftWorkout(session.user.id).catch((error) =>
        console.error('Failed to clear draft workout', error),
      );
    }
  }, [session, activeWorkout]);

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

  if (viewingWorkout) {
    return (
      <WorkoutDetailScreen
        workout={viewingWorkout}
        onBack={() => setViewingWorkout(null)}
        onChanged={refreshWorkouts}
        onDeleted={() => setViewingWorkout(null)}
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
      onSelectWorkout={setViewingWorkout}
      onSignOut={handleSignOut}
    />
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loading: { color: colors.text, padding: 24 },
});
