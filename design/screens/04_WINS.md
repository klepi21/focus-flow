# Screen 04 — Wins

## Purpose
ADHD brains forget what they accomplished. This screen exists to show them
their wins visually and emotionally. It must feel like a celebration, not a report.
The mood emoji must dominate — it gives instant emotional feedback.

---

## Layout (top → bottom)

```
┌─────────────────────────────────┐
│                                 │  ← Safe area top
│  Today's Wins                   │  ← 28px, 700, textPrimary
│                                 │
│              😄                 │  ← Giant mood emoji, 80px
│               4                 │  ← 72px, 800, textPrimary
│       tasks completed           │  ← 16px, textSecondary
│                                 │
│  ┌──────────┐  ┌──────────┐    │
│  │   🔥  7  │  │  🗑  2   │    │  ← Stat cards
│  │ day streak│  │  dropped  │    │
│  └──────────┘  └──────────┘    │
│                                 │
│  ─── COMPLETED ──────────────   │  ← Section divider
│                                 │
│  ✅ Write email to Sara         │  ← Completed task item
│  ✅ Review pull request         │
│  ✅ Morning standup             │
│  ✅ Take medication             │
│                                 │
│  ─── QUOTE ──────────────────   │
│                                 │
│  "ADHD brains need to see wins. │  ← Rotating motivational note
│   Every task counts."           │
│                                 │
│  ┌─────────────────────────────┐│
│  │    Share my wins  ↗         ││  ← Share button (premium)
│  └─────────────────────────────┘│
│                                 │  ← Safe area + tab bar
└─────────────────────────────────┘
```

---

## Mood Emoji System

```
0 tasks:      😴  "Rest is productive too"
1 task:       🌱  "You started. That matters."
2-3 tasks:    🙂  "Solid day."
4-6 tasks:    😄  "You're on a roll!"
7-10 tasks:   🔥  "On fire today!"
11+ tasks:    🤯  "Legendary focus day."

Emoji size:   80px
Animation:    bounces in from 0.5 scale → 1.1 → 1.0 (spring, 400ms)
              plays when screen mounts or count changes
```

---

## Big Number — Exact Spec

```
Font:         72px, 800, textPrimary
Line height:  80px
Alignment:    center
Animation:    counts up from 0 to real number (500ms, ease-out)
              each digit increments with tiny bounce
```

---

## Stat Cards — Exact Spec

```
Layout:       row, 2 cards, gap 12px, full width
Each card:
  Background: #1A1A2E
  Border:     1px solid #2D2D4E
  Border Radius: 16px
  Padding:    20px
  Alignment:  center

STREAK card:
  Top:        "🔥" — 24px emoji
  Number:     32px, 700, textPrimary
  Label:      "day streak" — 13px, textSecondary
  Active glow (if streak > 0):
    shadowColor: #F59E0B
    shadowRadius: 12
    shadowOpacity: 0.3

DROPPED card:
  Top:        "🗑" — 24px emoji
  Number:     32px, 700, textMuted
  Label:      "dropped today" — 13px, textMuted
  Note:       "dropping tasks is ok" — 11px, #475569 italic
```

---

## Completed Task List — Exact Spec

```
Section title: "COMPLETED" — 11px, 700, textMuted, letter-spacing: 2px
               "ALL DONE! 🎉" if list would overflow (5+ items)

Each item:
  Height:     48px
  Background: #1A1A2E
  Border Radius: 10px
  Padding:    14px 16px
  Margin bottom: 6px
  Left icon:  ✅ emoji, 18px
  Title:      15px, 400, textPrimary
  Right:      time completed — 12px, textMuted (e.g. "2:34 PM")

  Entry animation (on mount):
    Each item staggers: index * 50ms delay
    Fade in + slide up 8px → 0px
```

---

## Motivational Quote — Exact Spec

```
Background:   #1A1A2E
Border Radius: 14px
Padding:      20px
Border left:  3px solid #7C3AED

Quote pool (rotates daily, not randomly):
  "ADHD brains need to see wins. Every task counts, no matter how small."
  "Done is better than perfect. You proved it today."
  "Your brain works differently. Not worse. Differently."
  "You showed up today. That took more effort than they'll ever know."
  "Rest is not the enemy of productivity. It's the foundation."
  "Every task you completed today rewired your brain a little."

Font:         14px, 400, textSecondary, italic, lineHeight: 22
```

---

## Share Button (Premium Feature)

```
Background:     #252540
Border:         1px solid #7C3AED40
Border Radius:  14px
Height:         52px
Text:           "Share my wins  ↗" — 15px, 600, primaryLight

On press (free user):
  Bottom sheet: "Unlock sharing with Premium ✨"
  Show what they'd get: shareable card preview

Shareable card design (what gets exported as image):
  Dark card, 390x390px
  Large emoji + number + "tasks done today"
  App name bottom right
  Purple gradient border
```

---

## Assets Required for This Screen

| Asset                   | File                                    | Size / Type |
|------------------------|------------------------------------------|-------------|
| Streak celebration anim| assets/animations/streak.json           | Lottie      |
| Empty wins illustration| assets/illustrations/empty-wins.png     | 200x160px @3x |
| Shareable card template| (generated in-app, no static asset)     | —           |

See ASSETS_MANIFEST.md for generation prompts.
