import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import type { Workout } from '../types/workout';

export function History({ workouts }: { workouts: Workout[] }) {
  if (workouts.length === 0) {
    return (
      <Text style={styles.cardHint}>
        No saved workouts yet. Your completed sessions will appear here.
      </Text>
    );
  }
  return (
    <View style={styles.history}>
      <Text style={styles.sectionTitle}>Recent workouts</Text>
      {workouts.map((workout) => (
        <View style={styles.historyRow} key={workout.id}>
          <View>
            <Text style={styles.historyDate}>
              {new Date(workout.completedAt).toLocaleDateString()}
            </Text>
            <Text style={styles.cardHint}>{workout.exercises.length} exercises</Text>
          </View>
          <Text style={styles.cardHint}>
            {workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)} sets
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardHint: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  history: { gap: 10, marginTop: 8 },
  sectionTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  historyRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  historyDate: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
});
