/**
 * CLERK SIGN UP — NOT YET WIRED
 *
 * This is a placeholder screen. To activate:
 * 1. Follow docs/CLERK_INTEGRATION.md
 * 2. Install: npx expo install @clerk/clerk-expo expo-secure-store
 * 3. Replace this file with the full implementation
 *
 * What this screen needs:
 *   - Apple Sign In button (primary — required for App Store)
 *   - Email + password fields
 *   - useSignUp() from @clerk/clerk-expo
 *   - On success → router.replace('/(auth)/onboarding')
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/src/constants/colors';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>⚡</Text>
      <Text style={styles.title}>Get started</Text>
      <Text style={styles.subtitle}>Create your account and start focusing</Text>

      {/* TODO: Replace with Clerk Apple Sign Up */}
      <TouchableOpacity style={styles.appleBtn} onPress={() => {}}>
        <Text style={styles.appleBtnText}> Continue with Apple</Text>
      </TouchableOpacity>

      {/* TODO: Replace with Clerk email sign up */}
      <TouchableOpacity style={styles.emailBtn} onPress={() => {}}>
        <Text style={styles.emailBtnText}>Continue with email</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
        <Text style={styles.switchText}>
          Already have an account?{' '}
          <Text style={styles.switchLink}>Sign in</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.placeholder}>⚠️ Clerk not yet wired — see docs/CLERK_INTEGRATION.md</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  logo: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  appleBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleBtnText: { fontSize: 16, fontWeight: '700', color: '#000000' },
  emailBtn: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emailBtnText: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  switchText: { fontSize: 14, color: Colors.textSecondary },
  switchLink: { color: Colors.primaryLight, fontWeight: '600' },
  placeholder: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
});
