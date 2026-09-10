import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { signIn, signUp } from '../data/auth';
import { colors } from '../theme/colors';

export function AuthScreen() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Enter both an email and a password.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (mode === 'sign-in') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
        Alert.alert('Check your email', 'Confirm your address to finish creating your account.');
      }
    } catch (error) {
      Alert.alert(
        'Could not sign in',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>TRACKMATE</Text>
        <Text style={styles.title}>
          {mode === 'sign-in' ? 'Welcome back.' : 'Create your account.'}
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'sign-in'
            ? 'Sign in to sync your workouts.'
            : 'Your workouts stay private to your account.'}
        </Text>

        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#718096"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#718096"
            autoCapitalize="none"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={submit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.primaryButtonText}>
              {mode === 'sign-in' ? 'Sign in' : 'Sign up'}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => setMode((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'))}
        >
          <Text style={styles.switchModeText}>
            {mode === 'sign-in'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16 },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', lineHeight: 38 },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 22, marginBottom: 8 },
  form: { gap: 12 },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    padding: 14,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 14,
    padding: 17,
  },
  primaryButtonText: { color: colors.background, fontSize: 17, fontWeight: '800' },
  pressed: { opacity: 0.8 },
  switchModeText: { color: colors.accent, fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
