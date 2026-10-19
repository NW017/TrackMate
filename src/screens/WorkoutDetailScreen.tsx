import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SetRow } from '../components/SetRow';
import { deleteSet, deleteWorkout, deleteWorkoutExercise, updateSet } from '../data/workouts';
import { colors } from '../theme/colors';
import type { SetEntry, Workout, WorkoutExercise } from '../types/workout';

export function WorkoutDetailScreen({
  workout: initialWorkout,
  onBack,
  onChanged,
  onDeleted,
}: {
  workout: Workout;
  onBack: () => void;
  onChanged: () => void;
  onDeleted: () => void;
}) {
  const [workout, setWorkout] = useState(initialWorkout);

  const updateExercise = (
    exerciseId: string,
    updater: (exercise: WorkoutExercise) => WorkoutExercise,
  ) => {
    setWorkout((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? updater(exercise) : exercise,
      ),
    }));
  };

  const handleSaveSet = async (
    exerciseId: string,
    setId: string,
    changes: Omit<SetEntry, 'id'>,
  ) => {
    try {
      await updateSet(setId, changes);
      updateExercise(exerciseId, (exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) => (set.id === setId ? { ...set, ...changes } : set)),
      }));
      onChanged();
    } catch {
      Alert.alert('Could not save set', 'Please try again.');
    }
  };

  const handleDeleteSet = async (exerciseId: string, setId: string) => {
    try {
      await deleteSet(setId);
      updateExercise(exerciseId, (exercise) => ({
        ...exercise,
        sets: exercise.sets.filter((set) => set.id !== setId),
      }));
      onChanged();
    } catch {
      Alert.alert('Could not delete set', 'Please try again.');
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      await deleteWorkoutExercise(exerciseId);
      setWorkout((current) => ({
        ...current,
        exercises: current.exercises.filter((exercise) => exercise.id !== exerciseId),
      }));
      onChanged();
    } catch {
      Alert.alert('Could not delete exercise', 'Please try again.');
    }
  };

  const handleDeleteWorkout = () => {
    Alert.alert('Delete workout', 'This will permanently delete the whole workout.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteWorkout(workout.id);
            onChanged();
            onDeleted();
          } catch {
            Alert.alert('Could not delete workout', 'Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack}>
            <Text style={styles.headerAction}>Back</Text>
          </Pressable>
          <Text style={styles.screenTitle}>
            {new Date(workout.completedAt).toLocaleDateString()}
          </Text>
          <Pressable onPress={handleDeleteWorkout}>
            <Text style={styles.deleteWorkoutText}>Delete</Text>
          </Pressable>
        </View>

        {workout.exercises.length === 0 && (
          <Text style={styles.cardHint}>This workout has no exercises left.</Text>
        )}

        {workout.exercises.map((exercise) => (
          <DetailExerciseCard
            key={exercise.id}
            exercise={exercise}
            onSaveSet={(setId, changes) => handleSaveSet(exercise.id, setId, changes)}
            onDeleteSet={(setId) => handleDeleteSet(exercise.id, setId)}
            onRemoveExercise={() => handleDeleteExercise(exercise.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailExerciseCard({
  exercise,
  onSaveSet,
  onDeleteSet,
  onRemoveExercise,
}: {
  exercise: WorkoutExercise;
  onSaveSet: (setId: string, changes: Omit<SetEntry, 'id'>) => void;
  onDeleteSet: (setId: string) => void;
  onRemoveExercise: () => void;
}) {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeading}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Pressable onPress={onRemoveExercise}>
          <Text style={styles.removeExerciseText}>Remove</Text>
        </Pressable>
      </View>
      {exercise.sets.map((set, index) => (
        <SetRow
          key={set.id}
          setNumber={index + 1}
          set={set}
          onSave={(changes) => onSaveSet(set.id, changes)}
          onDelete={() => onDeleteSet(set.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, gap: 16 },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerAction: { color: colors.accent, fontSize: 16, fontWeight: '700' },
  screenTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  deleteWorkoutText: { color: '#f87171', fontSize: 14, fontWeight: '700' },
  cardHint: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  exerciseCard: { backgroundColor: colors.card, borderRadius: 16, gap: 10, padding: 16 },
  exerciseHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  exerciseName: { color: colors.text, fontSize: 19, fontWeight: '800' },
  removeExerciseText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
});
