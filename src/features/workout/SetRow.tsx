import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../theme/colors';
import type { SetEntry } from '../../types/workout';

export function SetRow({
  setNumber,
  set,
  onSave,
  onDelete,
}: {
  setNumber: number;
  set: SetEntry;
  onSave: (changes: Omit<SetEntry, 'id'>) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState(String(set.weightKg));
  const [reps, setReps] = useState(String(set.reps));
  const [notes, setNotes] = useState(set.notes);

  const startEditing = () => {
    setWeight(String(set.weightKg));
    setReps(String(set.reps));
    setNotes(set.notes);
    setIsEditing(true);
  };

  const save = () => {
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
    onSave({ weightKg, reps: repCount, notes: notes.trim() });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View style={styles.editingRow}>
        <Text style={styles.setNumber}>Set {setNumber}</Text>
        <View style={styles.editingInputs}>
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
        <View style={styles.editingActions}>
          <Pressable onPress={() => setIsEditing(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.smallButton} onPress={save}>
            <Text style={styles.smallButtonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable style={styles.setRow} onPress={startEditing}>
      <Text style={styles.setNumber}>Set {setNumber}</Text>
      <Text style={styles.setValue}>{set.weightKg} kg</Text>
      <Text style={styles.setValue}>{set.reps} reps</Text>
      {set.notes ? <Text style={styles.setNote}>{set.notes}</Text> : null}
      <Pressable onPress={onDelete}>
        <Text style={styles.removeSetText}>✕</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  removeSetText: { color: colors.muted, fontSize: 14, fontWeight: '700' },
  editingRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 10,
    paddingVertical: 9,
  },
  editingInputs: { flexDirection: 'row', gap: 10 },
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
  editingActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'flex-end',
  },
  cancelText: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  smallButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  smallButtonText: { color: colors.background, fontSize: 14, fontWeight: '800' },
});
