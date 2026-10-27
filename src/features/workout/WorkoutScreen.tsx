import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExerciseCard } from './ExerciseCard';
import { ExercisePicker } from '../exercise-catalog/ExercisePicker';
import { colors } from '../../theme/colors';
import type { Workout } from '../../types/workout';

export function WorkoutScreen({
  workout,
  onChange,
  onFinish,
  onCancel,
}: {
  workout: Workout;
  onChange: (workout: Workout) => void;
  onFinish: () => void;
  onCancel: () => void;
}) {
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  const addExercise = (name: string) => {
    onChange({
      ...workout,
      exercises: [...workout.exercises, { id: `local-${Date.now()}`, name, sets: [] }],
    });
    setShowExercisePicker(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={onCancel}>
            <Text style={styles.headerAction}>Cancel</Text>
          </Pressable>
          <Text style={styles.screenTitle}>New workout</Text>
          <Pressable onPress={onFinish}>
            <Text style={styles.headerAction}>Finish</Text>
          </Pressable>
        </View>

        {workout.exercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Add your first exercise</Text>
            <Text style={styles.cardHint}>Choose an exercise, then record each working set.</Text>
          </View>
        )}

        {workout.exercises.map((exercise, exerciseIndex) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onChange={(updated) => {
              const exercises = [...workout.exercises];
              exercises[exerciseIndex] = updated;
              onChange({ ...workout, exercises });
            }}
            onRemove={() => {
              onChange({
                ...workout,
                exercises: workout.exercises.filter((item) => item.id !== exercise.id),
              });
            }}
          />
        ))}

        <Pressable
          style={styles.secondaryButton}
          onPress={() => setShowExercisePicker((current) => !current)}
        >
          <Text style={styles.secondaryButtonText}>+ Add exercise</Text>
        </Pressable>

        {showExercisePicker && (
          <ExercisePicker
            existingExerciseNames={workout.exercises.map((exercise) => exercise.name)}
            onSelect={addExercise}
          />
        )}
      </ScrollView>
    </SafeAreaView>
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
  emptyState: {
    borderColor: colors.border,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 6 },
  cardHint: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 15,
  },
  secondaryButtonText: { color: colors.text, fontSize: 16, fontWeight: '700' },
});
