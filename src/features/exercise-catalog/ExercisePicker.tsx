import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getExerciseCatalog } from '../workout/workouts';
import { colors } from '../../theme/colors';

export function ExercisePicker({
  existingExerciseNames,
  onSelect,
}: {
  existingExerciseNames: string[];
  onSelect: (name: string) => void;
}) {
  const [catalog, setCatalog] = useState<{ id: string; name: string }[] | null>(null);
  const [customName, setCustomName] = useState('');

  useEffect(() => {
    getExerciseCatalog()
      .then(setCatalog)
      .catch((error) => {
        console.error('Failed to load exercise catalog', error);
        Alert.alert('Could not load exercises', 'Check your connection and try again.');
        setCatalog([]);
      });
  }, []);

  const isAlreadyAdded = (name: string) =>
    existingExerciseNames.some((existing) => existing.toLowerCase() === name.toLowerCase());

  const addCustom = () => {
    const name = customName.trim();
    if (!name) return;
    if (isAlreadyAdded(name)) {
      Alert.alert('Already added', 'That exercise is already in this workout.');
      return;
    }
    onSelect(name);
    setCustomName('');
  };

  if (catalog === null) {
    return (
      <View style={styles.picker}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  const availableCatalog = catalog.filter((exercise) => !isAlreadyAdded(exercise.name));

  return (
    <View style={styles.picker}>
      {availableCatalog.map((exercise) => (
        <Pressable
          key={exercise.id}
          style={styles.pickerRow}
          onPress={() => onSelect(exercise.name)}
        >
          <Text style={styles.pickerText}>{exercise.name}</Text>
        </Pressable>
      ))}
      {availableCatalog.length === 0 && (
        <Text style={styles.cardHint}>
          {catalog.length === 0
            ? "You haven't logged any exercises yet. Type one below to get started."
            : 'All your exercises are already in this workout.'}
        </Text>
      )}
      <View style={styles.customRow}>
        <TextInput
          value={customName}
          onChangeText={setCustomName}
          placeholder="New exercise"
          placeholderTextColor="#718096"
          style={[styles.input, styles.customInput]}
        />
        <Pressable style={styles.smallButton} onPress={addCustom}>
          <Text style={styles.smallButtonText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: { backgroundColor: colors.card, borderRadius: 16, padding: 8, gap: 8 },
  pickerRow: { borderBottomColor: colors.border, borderBottomWidth: 1, padding: 14 },
  pickerText: { color: colors.text, fontSize: 16 },
  cardHint: { color: colors.muted, fontSize: 14, lineHeight: 20, padding: 8 },
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
