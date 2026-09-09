import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { ExerciseCard } from '../components/ExerciseCard';
import { colors } from '../theme/colors';
import { seededExercises } from '../types/workout';
import type { Exercise, Workout } from '../types/workout';

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
  const [customExercise, setCustomExercise] = useState('');

  const addExercise = (exercise: Exercise) => {
    if (workout.exercises.some((item) => item.id === exercise.id)) {
      setShowExercisePicker(false);
      return;
    }
    onChange({ ...workout, exercises: [...workout.exercises, { ...exercise, sets: [] }] });
    setShowExercisePicker(false);
  };

  const addCustomExercise = () => {
    const name = customExercise.trim();
    if (!name) return;
    addExercise({ id: `custom-${Date.now()}`, name });
    setCustomExercise('');
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
          />
        ))}

        <Pressable
          style={styles.secondaryButton}
          onPress={() => setShowExercisePicker((current) => !current)}
        >
          <Text style={styles.secondaryButtonText}>+ Add exercise</Text>
        </Pressable>

        {showExercisePicker && (
          <View style={styles.picker}>
            {seededExercises.map((exercise) => (
              <Pressable
                key={exercise.id}
                style={styles.pickerRow}
                onPress={() => addExercise(exercise)}
              >
                <Text style={styles.pickerText}>{exercise.name}</Text>
              </Pressable>
            ))}
            <View style={styles.customRow}>
              <TextInput
                value={customExercise}
                onChangeText={setCustomExercise}
                placeholder="Custom exercise"
                placeholderTextColor="#718096"
                style={[styles.input, styles.customInput]}
              />
              <Pressable style={styles.smallButton} onPress={addCustomExercise}>
                <Text style={styles.smallButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>
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
  picker: { backgroundColor: colors.card, borderRadius: 16, padding: 8 },
  pickerRow: { borderBottomColor: colors.border, borderBottomWidth: 1, padding: 14 },
  pickerText: { color: colors.text, fontSize: 16 },
  customRow: { alignItems: 'center', flexDirection: 'row', gap: 8, padding: 8 },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    padding: 12,
  },
  customInput: { flex: 1 },
  smallButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  smallButtonText: { color: colors.background, fontSize: 14, fontWeight: '800' },
});
