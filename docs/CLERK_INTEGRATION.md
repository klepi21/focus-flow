# Clerk Auth Integration Guide

This doc covers everything needed to wire up Clerk authentication in Focus Flow.
All placeholder files are already created — follow the steps below when ready.

---

## Overview

**What Clerk handles:**
- Sign up / sign in (email + Apple Sign In)
- Session management + token refresh
- User identity (`userId`) for Supabase row-level security
- Secure token storage via `expo-secure-store`

**Flow:**
```
App open
  └─ ClerkProvider loads session
       ├─ Signed in  → index.tsx checks energy → Today or Onboarding
       └─ Signed out → (auth)/sign-in.tsx
```

---

## Step 1 — Install packages

```bash
npx expo install @clerk/clerk-expo expo-secure-store
```

---

## Step 2 — Create Clerk account & app

1. Go to https://clerk.com and create an account
2. Create a new application → name it "Focus Flow"
3. Enable **Email** and **Sign in with Apple** providers
4. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
5. Add to `.env`:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
```

---

## Step 3 — Apple Sign In setup (required for App Store)

In Clerk dashboard:
1. Go to **User & Authentication → Social Connections → Apple**
2. Follow Clerk's Apple setup guide — you need:
   - Apple Developer Team ID
   - App Bundle ID (`com.focusflow.app`)
   - A Services ID + private key from Apple Developer portal

> Apple Sign In is mandatory if ANY social login is offered in an iOS app (App Store rule).

---

## Step 4 — Token cache (already scaffolded)

File: `src/lib/clerk.ts`

This file is already created with the SecureStore token cache.
No changes needed — just make sure `expo-secure-store` is installed.

---

## Step 5 — Wrap app with ClerkProvider

In `app/_layout.tsx`, replace the current root with:

```tsx
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@/src/lib/clerk';

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

// Inside the return, wrap GestureHandlerRootView:
<ClerkProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
  <GestureHandlerRootView style={{ flex: 1 }}>
    ...
  </GestureHandlerRootView>
</ClerkProvider>
```

---

## Step 6 — Protect routes in index.tsx

Replace the current redirect logic with Clerk-aware version:

```tsx
import { useAuth } from '@clerk/clerk-expo';

const { isSignedIn, isLoaded } = useAuth();

// Wait for both Clerk and Zustand to hydrate
if (!isLoaded || !_hasHydrated) return <LoadingView />;

if (!isSignedIn) {
  router.replace('/(auth)/sign-in');
  return null;
}

// Existing energy check logic stays the same
if (todayEnergyDate === todayString()) {
  router.replace('/(tabs)/today');
} else {
  router.replace('/(auth)/onboarding');
}
```

---

## Step 7 — Sign In screen (already scaffolded)

File: `app/(auth)/sign-in.tsx`

Already created as a placeholder. Fill in the Clerk hooks:

```tsx
import { useSignIn } from '@clerk/clerk-expo';

const { signIn, setActive, isLoaded } = useSignIn();
```

For Apple Sign In button use:
```tsx
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';

WebBrowser.maybeCompleteAuthSession();
const { startOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });
```

---

## Step 8 — Sign Up screen (already scaffolded)

File: `app/(auth)/sign-up.tsx`

For most ADHD users, keep it frictionless:
- Apple Sign In as primary CTA
- Email as fallback

---

## Step 9 — Link Clerk userId to Supabase

When Supabase is set up, pass the Clerk token as the Supabase JWT:

```tsx
import { useSession } from '@clerk/clerk-expo';
import { supabase } from '@/src/lib/supabase';

const { session } = useSession();
const token = await session?.getToken({ template: 'supabase' });

// Then use token for authenticated Supabase calls
const { data } = await supabase
  .from('tasks')
  .select('*')
  .auth(token);
```

In Clerk dashboard: **JWT Templates → New template → Supabase**.

---

## Files Created (placeholders)

| File | Purpose |
|------|---------|
| `src/lib/clerk.ts` | SecureStore token cache |
| `app/(auth)/sign-in.tsx` | Sign in screen (email + Apple) |
| `app/(auth)/sign-up.tsx` | Sign up screen |

## Files to Update

| File | What to change |
|------|---------------|
| `app/_layout.tsx` | Wrap with `<ClerkProvider>` |
| `app/index.tsx` | Add `useAuth()` check before redirect |
| `src/lib/supabase.ts` | Pass Clerk JWT for authenticated requests |
| `.env` | Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` |

---

## Checklist

- [ ] `npm install @clerk/clerk-expo expo-secure-store`
- [ ] Create Clerk app at clerk.com
- [ ] Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env`
- [ ] Set up Apple Sign In in Clerk dashboard
- [ ] Wrap `_layout.tsx` with `ClerkProvider`
- [ ] Update `index.tsx` with `useAuth()` guard
- [ ] Build sign-in screen (Apple + email)
- [ ] Build sign-up screen
- [ ] Create JWT template in Clerk for Supabase
- [ ] Test sign in → energy check-in → today screen flow
- [ ] Test sign out → redirects to sign-in
