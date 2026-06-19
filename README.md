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
Wake up → Set energy level → See your 3 tasks for the day → Focus → Win
```

1. **Morning Check-in** — Pick Low / Medium / High energy. The app sets realistic expectations based on your answer.
2. **Today Screen** — Three slots: NOW (do this first), NEXT (do this second), LATER (if energy allows). Swipe to promote or drop tasks.
3. **Focus Timer** — A beautiful water-fill timer. Watch the glass fill as you work. Body-double message cards keep you company.
4. **Wins Screen** — See what you completed, your streak, and a motivational quote. Dropping tasks is OK too — it's tracked without judgment.

---

## What's Built

### Screens
| Screen | Status | Description |
|--------|--------|-------------|
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
| `CelebrationOverlay` | Ring burst animation on task completion (Lottie swap-ready) |
| `EnergyCard` | Animated spring tap, colored left bar when selected |
| `StreakBadge` | Flame + day count |
| `IllustrationPlaceholder` | Emoji fallback until real AI-generated assets are dropped in |

### State & Logic
- **Zustand + AsyncStorage** — full persistence across app restarts
- **Daily reset** — runs on first open each day: checks yesterday's completions for streak, clears done/dropped tasks, resets energy
- **Streak logic** — increments only if you completed ≥1 task yesterday; resets to 0 if you skipped a day
- **Hydration guard** — `_hasHydrated` flag prevents redirect flicker before AsyncStorage loads
- **Smart redirect** — if energy already set today → Today screen; if not → Morning Check-in

### Infrastructure
- **RevenueCat** — monthly ($9.99) and annual ($59.99) subscriptions via Apple StoreKit
- **Expo Notifications** — daily reminder, user-configurable time (6am–12pm)
- **Supabase** — client configured, ready for auth + cloud sync (env keys needed)
- **Haptics** — throughout: task complete, add, swipe, energy select, purchase

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Expo (React Native) | Fast iteration, managed workflow, EAS builds |
| Routing | Expo Router v2 | File-based, typed routes, modal support |
| State | Zustand + persist | Simple, no boilerplate, works great with AsyncStorage |
| Subscriptions | RevenueCat | Handles StoreKit complexity, receipt validation, restore |
| Animations | RN Animated + react-native-svg | Native driver for performance; SVG for the water timer |
| Gestures | react-native-gesture-handler | Swipeable task cards |
| Backend | Supabase | Auth + Postgres, ready to wire up |
| Haptics | expo-haptics | Tactile feedback throughout |
| Notifications | expo-notifications | Daily reminders with user-set time |

---

## Project Structure

```
focus-flow/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root layout, notifications, RevenueCat init
│   ├── index.tsx               # Hydration guard + daily reset + smart redirect
│   ├── (auth)/
│   │   └── onboarding.tsx      # Morning energy check-in
│   ├── (tabs)/
│   │   ├── today.tsx           # Main task screen
│   │   ├── focus.tsx           # Water timer + body double
│   │   └── wins.tsx            # Completions + streak + quote
│   └── modal/
│       ├── add-task.tsx        # Add task to a slot
│       ├── distracted.tsx      # Breathing reset modal
│       ├── settings.tsx        # App settings
│       └── paywall.tsx         # Premium upsell
├── src/
│   ├── components/             # Reusable UI components
│   ├── constants/colors.ts     # Single source of truth for the design system
│   ├── hooks/                  # useGreeting, useMotivationalQuote
│   ├── lib/                    # revenuecat.ts, supabase.ts
│   ├── store/taskStore.ts      # All app state (Zustand)
│   └── types/index.ts          # TypeScript interfaces
├── assets/
│   ├── illustrations/          # Drop AI-generated PNGs here
│   └── animations/             # Drop Lottie JSON files here
└── design/                     # Design specs (read before editing screens)
    ├── DESIGN_SYSTEM.md
    ├── ASSETS_MANIFEST.md      # Every asset with AI generation prompts
    └── screens/                # Per-screen layout specs
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

### Immediate (before TestFlight)
- [ ] Drop in AI-generated assets (prompts are all in `design/ASSETS_MANIFEST.md`)
- [ ] Create Supabase project → fill `.env` keys
- [ ] Create RevenueCat account → fill `.env` key → link App Store products
- [ ] EAS Build setup: `eas build --platform ios --profile preview`
- [ ] Decide final app name → update `app.json` + bundle identifier

### Assets needed (AI prompts ready)
| Asset | Tool | Size |
|-------|------|------|
| Energy Low illustration | Adobe Firefly | 156×156 @3x |
| Energy Medium illustration | Adobe Firefly | 156×156 @3x |
| Energy High illustration | Adobe Firefly | 156×156 @3x |
| Empty tasks state | Midjourney | 600×480 @3x |
| Empty wins state | Midjourney | 600×480 @3x |
| Day complete | Midjourney | 600×480 @3x |
| Task complete animation | LottieFiles | JSON |
| Breathing animation | LottieFiles | JSON |
| App icon | Canva | 1024×1024 |

### Later
- [ ] Apple Sign In / magic link auth (Supabase)
- [ ] Cloud sync — tasks across devices
- [ ] Weekly focus report
- [ ] iPad / macOS support
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
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_revenuecat_ios_key
```

---

## Monetization

| Plan | Price | Notes |
|------|-------|-------|
| Free | $0 | Core task management, focus timer |
| Monthly | $9.99/mo | Unlimited tasks, weekly reports, cloud sync, themes |
| Annual | $59.99/yr | Same as monthly — 50% saving |

Subscriptions handled by **RevenueCat** on top of Apple StoreKit. Receipt validation, restore purchases, and entitlement management are all handled server-side.

---

*Built for the ADHD brain. One task at a time.*
