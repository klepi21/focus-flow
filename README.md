# Focus Flow ⚡

> An ADHD-first productivity app that works *with* your brain, not against it.

Focus Flow is an iOS app built for people with ADHD who are overwhelmed by traditional to-do apps. Instead of endless lists, it gives you three simple slots — **NOW**, **NEXT**, and **LATER** — matched to your energy level that morning.

---

## The Problem

Most productivity apps assume you have a consistent, predictable brain. ADHD doesn't work that way. You might wake up at full power one day and barely functional the next. Tasks pile up. Priorities feel impossible to rank. The app itself becomes another source of anxiety.

Focus Flow solves this by asking one question every morning: **How's your energy today?** Everything else adapts from there.

---

## Core Flow

```
Wake up → Sign in → Set energy level → See your 3 tasks for the day → Focus → Win
```

1. **Sign In** — Apple Sign In or email via Clerk. Fast, secure, no password friction.
2. **Morning Check-in** — Pick Low / Medium / High energy. The app sets realistic expectations based on your answer.
3. **Today Screen** — Three slots: NOW (do this first), NEXT (do this second), LATER (if energy allows). Swipe to promote or drop tasks.
4. **Focus Timer** — A beautiful water-fill timer. Watch the glass fill as you work. Body-double message cards keep you company.
5. **Wins Screen** — See what you completed, your streak, and a motivational quote. Dropping tasks is OK too — it's tracked without judgment.

---

## What's Built

### Screens
| Screen | Status | Description |
|--------|--------|-------------|
| Sign In | 🔲 Scaffolded | Placeholder UI ready — Clerk hooks to wire in |
| Sign Up | 🔲 Scaffolded | Placeholder UI ready — Clerk hooks to wire in |
| Morning Check-in | ✅ Done | Energy selection with animated cards and time-based greeting |
| Today | ✅ Done | NOW/NEXT/LATER task slots, swipe gestures, FAB, celebration overlay |
| Focus Timer | ✅ Done | SVG water-fill animation, 4 presets, body double card, done state |
| Wins | ✅ Done | Animated task count, streak card, dropped tasks, motivational quote |
| Add Task | ✅ Done | Slot-aware modal, time estimate pills, haptic feedback |
| Distracted | ✅ Done | Breathing animation, optional note, refocus CTA |
| Settings | ✅ Done | Energy override, notification time, clear tasks, premium link |
| Paywall | ✅ Done | Feature list, monthly/annual plan selector, restore purchases |

### Components
| Component | Description |
|-----------|-------------|
| `WaterTimer` | SVG wave animation with quadratic bezier paths, fills in real time |
| `TaskCard` | Swipeable — left promotes to higher slot, right drops with trash icon |
| `SlotSection` | Colored slot header + task list + empty state with dashed add button |
| `CelebrationOverlay` | Ring burst animation on task completion — built in RN Animated, no external files |
| `EnergyCard` | Animated spring tap, colored left bar when selected |
| `StreakBadge` | Flame + day count |
| `IllustrationPlaceholder` | Emoji fallback until real assets are dropped in |

### State & Logic
- **Zustand + AsyncStorage** — full persistence across app restarts
- **Daily reset** — runs on first open each day: checks yesterday's completions for streak, clears done/dropped tasks, resets energy
- **Streak logic** — increments only if you completed ≥1 task yesterday; resets to 0 if you skipped a day
- **Hydration guard** — `_hasHydrated` flag prevents redirect flicker before AsyncStorage loads
- **Smart redirect** — signed out → sign-in; signed in + energy set → Today; signed in + no energy → Check-in

### Infrastructure
- **Clerk** — authentication (Apple Sign In + email), session management, secure token storage
- **RevenueCat** — monthly ($9.99) and annual ($59.99) subscriptions via Apple StoreKit
- **Expo Notifications** — daily reminder, user-configurable time (6am–12pm)
- **Supabase** — client configured, ready for cloud sync once Clerk JWT template is set up
- **Haptics** — throughout: task complete, add, swipe, energy select, purchase

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Expo (React Native) | Fast iteration, managed workflow, EAS builds |
| Routing | Expo Router v2 | File-based, typed routes, modal support |
| Auth | Clerk | Best-in-class auth UX, Apple Sign In, session handling |
| State | Zustand + persist | Simple, no boilerplate, works great with AsyncStorage |
| Subscriptions | RevenueCat | Handles StoreKit complexity, receipt validation, restore |
| Animations | RN Animated + react-native-svg | All code-based — no external asset files needed |
| Gestures | react-native-gesture-handler | Swipeable task cards |
| Backend | Supabase | Postgres + row-level security, links to Clerk via JWT |
| Haptics | expo-haptics | Tactile feedback throughout |
| Notifications | expo-notifications | Daily reminders with user-set time |

---

## Animated Assets — All Code-Based

Every animation in the app is built in code. No Lottie files, no external assets required.

| Animation | How it's built |
|-----------|---------------|
| Water timer wave | `react-native-svg` — quadratic bezier paths updated via `setInterval` at 25fps |
| Task completion burst | `RN Animated` — ring scale `0→3` + opacity `1→0` over 800ms |
| Breathing circle | `RN Animated` — scale loop `1→1.4→1` on 4s ease cycle |
| Energy card tap | `RN Animated` — spring bounce on press |
| Wins count | `RN Animated` — number interpolation from 0 to count |
| Mood emoji | `RN Animated` — spring scale in on mount |

The only static files the app needs are the **app icon** and **splash screen**.

---

## Project Structure

```
focus-flow/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root layout — wrap with ClerkProvider here
│   ├── index.tsx               # Hydration guard + auth check + smart redirect
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx         # 🔲 Clerk sign in (scaffolded)
│   │   ├── sign-up.tsx         # 🔲 Clerk sign up (scaffolded)
│   │   └── onboarding.tsx      # Morning energy check-in
│   ├── (tabs)/
│   │   ├── today.tsx           # Main task screen
│   │   ├── focus.tsx           # Water timer + body double
│   │   └── wins.tsx            # Completions + streak + quote
│   └── modal/
│       ├── add-task.tsx
│       ├── distracted.tsx
│       ├── settings.tsx
│       └── paywall.tsx
├── src/
│   ├── components/             # All reusable UI components
│   ├── constants/colors.ts     # Single source of truth for the design system
│   ├── hooks/                  # useGreeting, useMotivationalQuote
│   ├── lib/
│   │   ├── clerk.ts            # 🔲 SecureStore token cache (ready to use)
│   │   ├── revenuecat.ts       # RevenueCat init + purchase helpers
│   │   └── supabase.ts         # Supabase client (needs env keys)
│   ├── store/taskStore.ts      # All app state (Zustand)
│   └── types/index.ts
├── assets/                     # Only icon + splash needed
├── docs/
│   └── CLERK_INTEGRATION.md   # Step-by-step Clerk wiring guide
└── design/                     # Design specs — read before editing screens
    ├── DESIGN_SYSTEM.md
    ├── ASSETS_MANIFEST.md
    └── screens/
```

---

## Design System

**Dark theme only.** No light mode — dark is calmer and easier on ADHD eyes.

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0F0F1A` | App background |
| Surface | `#1A1A2E` | Cards, modals |
| Surface High | `#252540` | Elevated elements |
| Primary | `#7C3AED` | CTA buttons, NOW slot |
| Primary Light | `#A855F7` | Highlights, active states |
| Next | `#2563EB` | NEXT slot accent |
| Later | `#475569` | LATER slot (de-emphasized) |
| Success | `#10B981` | Completions |
| Warning | `#F59E0B` | Streak glow |
| Danger | `#EF4444` | Drop / destructive |

Font: **System SF Pro** — no custom fonts, keeps it fast and native.

---

## What's Next

### Before TestFlight
- [ ] **Clerk auth** — full guide in `docs/CLERK_INTEGRATION.md`
  - [ ] `npx expo install @clerk/clerk-expo expo-secure-store`
  - [ ] Create Clerk app at clerk.com → copy publishable key → add to `.env`
  - [ ] Set up Apple Sign In in Clerk dashboard
  - [ ] Wrap `_layout.tsx` with `<ClerkProvider>`
  - [ ] Wire `useAuth()` guard in `index.tsx`
  - [ ] Implement sign-in and sign-up screens
- [ ] **RevenueCat** — create account → fill `.env` → link App Store products
- [ ] **Supabase** — create project → fill `.env` → create JWT template for Clerk
- [ ] **App icon + splash** — only static assets needed (Canva, 15 min job)
- [ ] **EAS Build**: `eas build --platform ios --profile preview`
- [ ] Decide final app name → update `app.json` bundle identifier

### Later
- [ ] Cloud sync — tasks across devices via Supabase (Clerk userId as row key)
- [ ] Weekly focus report
- [ ] Push notifications for streaks
- [ ] iPad support
- [ ] Android port

---

## Running Locally

> **Expo Go won't work** — the app uses native modules (SVG, gesture handler, RevenueCat). You need an EAS Dev Build.

```bash
# Install dependencies
npm install

# Start Metro bundler
npx expo start

# Build for device (requires EAS account)
npm install -g eas-cli
eas build --platform ios --profile development
```

Create a `.env` file at the root (never committed):

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_revenuecat_ios_key
```

---

## Monetization

| Plan | Price | What's included |
|------|-------|-----------------|
| Free | $0 | Core task management, focus timer, streak |
| Monthly | $9.99/mo | Unlimited tasks, weekly reports, cloud sync, themes |
| Annual | $59.99/yr | Everything in monthly — 50% saving |

Subscriptions handled by **RevenueCat** on top of Apple StoreKit. Receipt validation, restore purchases, and entitlement management are all server-side.

---

## Auth Architecture

```
ClerkProvider (app/_layout.tsx)
    │
    ├─ useAuth().isSignedIn = false  →  (auth)/sign-in.tsx
    │                                        │
    │                              Apple / Email sign in
    │                                        │
    └─ useAuth().isSignedIn = true  →  index.tsx checks energy
                                             │
                                    ┌────────┴────────┐
                              energy set          no energy
                                  │                   │
                           (tabs)/today       (auth)/onboarding
```

Full wiring guide: [`docs/CLERK_INTEGRATION.md`](./docs/CLERK_INTEGRATION.md)

---

*Built for the ADHD brain. One task at a time.*
