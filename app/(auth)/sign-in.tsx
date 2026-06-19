/**
 * CLERK SIGN IN — NOT YET WIRED
 *
 * This is a placeholder screen. To activate:
 * 1. Follow docs/CLERK_INTEGRATION.md
 * 2. Install: npx expo install @clerk/clerk-expo expo-secure-store
 * 3. Replace this file with the full implementation from Step 7
 *
 * What this screen needs:
 *   - Apple Sign In button (primary — required for App Store)
 *   - Email + password as fallback
 *   - "Don't have an account? Sign up" link → /(auth)/sign-up
 *   - useSignIn() + useOAuth({ strategy: 'oauth_apple' }) from @clerk/clerk-expo
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/src/constants/colors';

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>⚡</Text>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to continue your focus journey</Text>

      {/* TODO: Replace with Clerk Apple Sign In */}
      <TouchableOpacity style={styles.appleBtn} onPress={() => {}}>
        <Text style={styles.appleBtnText}> Sign in with Apple</Text>
      </TouchableOpacity>

      {/* TODO: Replace with Clerk email sign in */}
      <TouchableOpacity style={styles.emailBtn} onPress={() => {}}>
        <Text style={styles.emailBtnText}>Continue with email</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
        <Text style={styles.switchText}>
          No account yet?{' '}
          <Text style={styles.switchLink}>Sign up</Text>
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
