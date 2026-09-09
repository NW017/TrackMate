import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';
import type { WorkoutExercise } from '../types/workout';

export function ExerciseCard({
  exercise,
  onChange,
}: {
  exercise: WorkoutExercise;
  onChange: (exercise: WorkoutExercise) => void;
}) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');
  const totalVolume = useMemo(
    () => exercise.sets.reduce((total, set) => total + set.weightKg * set.reps, 0),
    [exercise.sets],
  );

  const addSet = () => {
    const weightKg = Number(weight);
    const repCount = Number(reps);
    if (
      !Number.isFinite(weightKg) ||
      weightKg < 0 ||
      !Number.isInteger(repCount) ||
      repCount <= 0
    ) {
      Alert.alert('Check your set', 'Enter a weight of 0 or more and a whole number of reps.');
      return;
    }
    onChange({
      ...exercise,
      sets: [
        ...exercise.sets,
        { id: `set-${Date.now()}`, weightKg, reps: repCount, notes: notes.trim() },
      ],
    });
    setWeight('');
    setReps('');
    setNotes('');
  };

  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeading}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.volume}>{totalVolume.toFixed(1)} kg</Text>
      </View>
      {exercise.sets.map((set, index) => (
        <View style={styles.setRow} key={set.id}>
          <Text style={styles.setNumber}>Set {index + 1}</Text>
          <Text style={styles.setValue}>{set.weightKg} kg</Text>
          <Text style={styles.setValue}>{set.reps} reps</Text>
          {set.notes ? <Text style={styles.setNote}>{set.notes}</Text> : null}
        </View>
      ))}
      <View style={styles.inputRow}>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          placeholder="kg"
          placeholderTextColor="#718096"
          style={styles.input}
        />
        <TextInput
          value={reps}
          onChangeText={setReps}
          keyboardType="number-pad"
          placeholder="reps"
          placeholderTextColor="#718096"
          style={styles.input}
        />
      </View>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional note"
        placeholderTextColor="#718096"
        style={styles.notesInput}
      />
      <Pressable style={styles.smallButton} onPress={addSet}>
        <Text style={styles.smallButtonText}>Add set</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseCard: { backgroundColor: colors.card, borderRadius: 16, gap: 10, padding: 16 },
  exerciseHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  exerciseName: { color: colors.text, fontSize: 19, fontWeight: '800' },
  volume: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  setRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 9,
  },
  setNumber: { color: colors.muted, flex: 1, fontSize: 13 },
  setValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
  setNote: { color: colors.muted, flex: 1, fontSize: 12, textAlign: 'right' },
  inputRow: { flexDirection: 'row', gap: 10 },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    padding: 12,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    padding: 12,
  },
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
