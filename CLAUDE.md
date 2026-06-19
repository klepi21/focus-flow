@AGENTS.md

# Focus Flow — Project Memory for Claude Code

## What This App Is
An ADHD productivity app for iOS built with Expo React Native.
Core concept: morning energy check-in → NOW/NEXT/LATER task view → focus timer → wins screen.
Target audience: adults with ADHD who are overwhelmed by traditional to-do apps.
Monetization: $9.99/month or $59.99/year via RevenueCat (Apple StoreKit).

---

## Where We Left Off (June 2026)

### PHASE COMPLETED: Design & Asset Planning
We did design-first before writing any real screens.
All design specs are documented. No screens are built yet to their final design.
The existing screen files in app/ are SCAFFOLDS ONLY — rough placeholders, not final.

### Last action taken:
All gaps fixed. Persistence, daily reset, streak, smart redirect, settings, paywall all done.
Zero TypeScript errors. App is complete UI-wise — only missing env keys + EAS build.

---

## What Is Done ✅

### Project Setup
- [x] Expo project created at `/Desktop/focus-flow` (TypeScript, Expo Router)
- [x] All packages installed: expo-router, expo-haptics, expo-av, expo-notifications,
      react-native-reanimated, react-native-purchases (RevenueCat), lottie-react-native,
      @supabase/supabase-js, react-native-gesture-handler, zustand
- [x] babel.config.js configured (Reanimated plugin included)
- [x] app.json configured (scheme, bundle ID, notifications plugin, dark theme)
- [x] tsconfig.json configured (path aliases @/* → ./*)
- [x] TypeScript: zero errors

### Architecture Files
- [x] src/constants/colors.ts — full color system
- [x] src/types/index.ts — Task, EnergyLevel, TaskSlot, UserProfile types
- [x] src/lib/supabase.ts — Supabase client (needs .env values)
- [x] src/lib/revenuecat.ts — RevenueCat init, checkPremium, purchase, restore
- [x] src/store/taskStore.ts — Zustand store (tasks, energy, streak, CRUD)

### Screens (FINAL — built to design spec)
- [x] app/_layout.tsx
- [x] app/index.tsx
- [x] app/(auth)/_layout.tsx
- [x] app/(auth)/onboarding.tsx — energy cards, greeting logic, haptics, CTA glow
- [x] app/(tabs)/_layout.tsx — tab bar with emoji icons
- [x] app/(tabs)/today.tsx — header, 3 slots, FAB, celebration overlay, distracted button
- [x] app/(tabs)/focus.tsx — water timer, presets, body double card, done state
- [x] app/(tabs)/wins.tsx — animated count, mood emoji, stat cards, quote
- [x] app/modal/add-task.tsx — slot badge, input, time estimate, haptics
- [x] app/modal/distracted.tsx — breathing animation, optional note, back-to-work CTA

### Components
- [x] src/components/IllustrationPlaceholder.tsx — shows emoji placeholder until real asset dropped in
- [x] src/components/CelebrationOverlay.tsx — ring burst animation (swap for Lottie later)
- [x] src/components/StreakBadge.tsx — flame + count
- [x] src/components/EnergyCard.tsx — animated selection card with left color bar
- [x] src/components/TaskCard.tsx — swipe left→delete, swipe right→promote, haptics
- [x] src/components/SlotSection.tsx — slot header + task list + add button
- [x] src/components/WaterTimer.tsx — SVG wave timer, fill animates, wave scrolls when running

### Hooks
- [x] src/hooks/useGreeting.ts — time-based greeting (morning/afternoon/evening/night owl)
- [x] src/hooks/useMotivationalQuote.ts — day-based quote rotation

### Design Documents (source of truth for all screens)
- [x] design/DESIGN_SYSTEM.md — colors, typography, spacing, animation rules
- [x] design/screens/01_MORNING_CHECKIN.md — full layout + component specs
- [x] design/screens/02_TODAY.md — task card anatomy, slots, gestures, flows
- [x] design/screens/03_FOCUS.md — water timer, body double, completion flow
- [x] design/screens/04_WINS.md — mood system, stats, motivational quotes
- [x] design/ASSETS_MANIFEST.md — every asset with AI prompts + which tool

### Asset Folders Created (empty, waiting for generated assets)
- [x] assets/illustrations/
- [x] assets/animations/
- [x] assets/svg/
- [x] assets/textures/

---

## What Is NOT Done ❌

### Assets (user is generating these now)
- [ ] assets/icon.png — App icon 1024x1024 (Canva)
- [ ] assets/splash-icon.png — Splash screen (Canva)
- [ ] assets/illustrations/energy-low.png — 156x156px @3x (Adobe Firefly)
- [ ] assets/illustrations/energy-medium.png — 156x156px @3x (Adobe Firefly)
- [ ] assets/illustrations/energy-high.png — 156x156px @3x (Adobe Firefly)
- [ ] assets/illustrations/empty-tasks.png — 600x480px @3x (Midjourney)
- [ ] assets/illustrations/empty-wins.png — 600x480px @3x (Midjourney)
- [ ] assets/illustrations/day-complete.png — 600x480px @3x (Midjourney)
- [ ] assets/illustrations/body-double.png — 192x192px @3x (Adobe Firefly)
- [ ] assets/animations/task-complete.json — Lottie (LottieFiles search)
- [ ] assets/animations/timer-complete.json — Lottie (LottieFiles search)
- [ ] assets/animations/streak.json — Lottie (LottieFiles search)
- [ ] assets/animations/breathe.json — Lottie (LottieFiles search)
- [ ] assets/svg/wave.svg — Water timer wave (manual or SVG generator)

### Screens
- [x] All screens built — see done list above
- [x] app/modal/settings.tsx — energy change, notification toggle + time, clear tasks, premium link
- [x] app/modal/paywall.tsx — feature list, monthly/annual plan selector, purchase + restore

### Backend / Supabase
- [ ] Create Supabase project at supabase.com
- [ ] Fill in .env: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
- [ ] Create Supabase tables (tasks, user_profiles, daily_plans)
- [ ] Set up auth (email magic link or Apple Sign In)
- [ ] Sync tasks to Supabase (currently local Zustand only)

### RevenueCat
- [ ] Create RevenueCat account at revenuecat.com
- [ ] Fill in .env: EXPO_PUBLIC_REVENUECAT_IOS_KEY
- [ ] Create product in App Store Connect ($9.99/mo and $59.99/yr)
- [ ] Link product to RevenueCat offering

### Notifications
- [ ] Set up push notification permissions flow
- [ ] Daily morning reminder (8am default, user sets time)
- [ ] "Time to focus" reminder if no tasks completed by noon

### EAS Build
- [ ] Install EAS CLI: npm install -g eas-cli
- [ ] eas login
- [ ] eas build:configure
- [ ] First TestFlight build: eas build --platform ios

---

## Immediate Next Steps (in order)

1. **Drop in assets** — all placeholders are wired and auto-activate when files exist:
   - assets/illustrations/energy-low.png → uncomment `illustrationSource` in EnergyCard.tsx:27
   - assets/illustrations/energy-medium.png → same
   - assets/illustrations/energy-high.png → same
   - assets/illustrations/body-double.png → uncomment source in focus.tsx IllustrationPlaceholder
   - assets/illustrations/empty-wins.png → uncomment source in wins.tsx IllustrationPlaceholder
   - assets/animations/task-complete.json → swap CelebrationOverlay.tsx for Lottie (see comment in file)
   - assets/animations/breathe.json → swap BreathingCircle in distracted.tsx for Lottie (see comment)

2. **App icon + splash** via Canva (prompts in design/ASSETS_MANIFEST.md §1.1 and §1.2)

3. **Set up Supabase** — create project, fill .env, create tables, add auth

4. **EAS Build setup**:
   npm install -g eas-cli
   eas login
   eas build:configure
   eas build --platform ios --profile preview  ← for TestFlight

5. **Decide app name** → update app.json (name, slug, bundleIdentifier) + CLAUDE.md

---

## Key Decisions Made

- iOS only (Android later, maybe never)
- Dark theme only (no light mode)
- No backend until screens are done (Zustand local state first)
- RevenueCat for subscriptions (not custom StoreKit)
- Expo Dev Client needed (not Expo Go) — has native modules
- Name "focus-flow" is placeholder — final name TBD
- bundle ID: com.focusflow.app (will need to change when name decided)
- Color palette is FIXED — do not change without updating design/DESIGN_SYSTEM.md
- Font: system SF Pro only (no custom fonts, keeps it fast and native)
- Emoji for tab bar icons for now (switch to Ionicons before App Store)

---

## Node Version Warning
Current Node: v20.15.0 — slightly outdated for this Expo version.
Warnings appear but everything works fine.
Upgrade when convenient: nvm install 22 && nvm use 22
Not blocking anything right now.

---

## File Map
```
focus-flow/
├── app/                    ← Expo Router screens (scaffolds, not final)
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/onboarding.tsx
│   ├── (tabs)/today.tsx
│   ├── (tabs)/focus.tsx
│   ├── (tabs)/wins.tsx
│   └── modal/add-task.tsx
├── src/
│   ├── constants/colors.ts ← SINGLE SOURCE OF TRUTH for colors
│   ├── types/index.ts
│   ├── lib/supabase.ts
│   ├── lib/revenuecat.ts
│   └── store/taskStore.ts  ← All app state lives here
├── assets/
│   ├── illustrations/      ← DROP AI-GENERATED PNGs HERE
│   ├── animations/         ← DROP LOTTIE JSON FILES HERE
│   ├── svg/                ← wave.svg goes here
│   └── textures/
├── design/                 ← READ THESE BEFORE TOUCHING ANY SCREEN
│   ├── DESIGN_SYSTEM.md
│   ├── ASSETS_MANIFEST.md
│   └── screens/
│       ├── 01_MORNING_CHECKIN.md
│       ├── 02_TODAY.md
│       ├── 03_FOCUS.md
│       └── 04_WINS.md
├── .env                    ← NOT committed, fill in keys
├── app.json
├── babel.config.js
└── tsconfig.json
```
