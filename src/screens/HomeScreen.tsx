import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { History } from '../components/History';
import { colors } from '../theme/colors';
import type { Workout } from '../types/workout';

export function HomeScreen({
  workouts,
  screen,
  onStartWorkout,
  onViewHistory,
  onSignOut,
}: {
  workouts: Workout[];
  screen: 'home' | 'history';
  onStartWorkout: () => void;
  onViewHistory: () => void;
  onSignOut: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.eyebrow}>TRACKMATE</Text>
          <Pressable onPress={onSignOut}>
            <Text style={styles.headerAction}>Sign out</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>Train with intention.</Text>
        <Text style={styles.subtitle}>
          Log your workouts and pick up where you left off, on any device.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={onStartWorkout}
        >
          <Text style={styles.primaryButtonText}>Start workout</Text>
        </Pressable>

        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>WORKOUTS COMPLETED</Text>
          <Text style={styles.summaryValue}>{workouts.length}</Text>
          <Text style={styles.cardHint}>Synced to your account.</Text>
        </View>

        <Pressable style={styles.secondaryButton} onPress={onViewHistory}>
          <Text style={styles.secondaryButtonText}>View workout history</Text>
        </Pressable>

        {screen === 'history' && <History workouts={workouts} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, gap: 16 },
  headerRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  headerAction: { color: colors.muted, fontSize: 14, fontWeight: '700' },
  title: { color: colors.text, fontSize: 36, fontWeight: '800', lineHeight: 42 },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24, marginBottom: 8 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 14,
    padding: 17,
  },
  primaryButtonText: { color: colors.background, fontSize: 17, fontWeight: '800' },
  pressed: { opacity: 0.8 },
  summaryCard: { backgroundColor: colors.card, borderRadius: 18, padding: 20 },
  cardLabel: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  summaryValue: { color: colors.text, fontSize: 42, fontWeight: '800', marginVertical: 8 },
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
