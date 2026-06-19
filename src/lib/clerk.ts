import * as SecureStore from 'expo-secure-store';
import type { TokenCache } from '@clerk/clerk-expo/dist/cache';

// Clerk requires a secure token cache — SecureStore keeps tokens in the iOS Keychain
export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // silently fail — Clerk will re-fetch on next launch
    }
  },
  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {}
  },
};
