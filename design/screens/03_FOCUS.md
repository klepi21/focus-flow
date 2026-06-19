# Screen 03 — Focus Timer

## Purpose
One job: help the user work without guilt.
The visual timer gives ADHD brains a real "feel" for time passing.
The body double card removes the loneliness of solo work.

---

## Layout (top → bottom)

```
┌─────────────────────────────────┐
│                                 │  ← Safe area top
│  Focus                          │  ← 28px, 700, textPrimary
│  Work alongside the timer 🧑‍💻   │  ← 14px, textSecondary
│                                 │
│         ┌───────────┐           │
│         │  ░░░░░░░  │           │  ← Circular timer
│         │  ░░░░░░░  │  WATER    │  ← Water fills from bottom
│         │  ▓▓▓▓▓▓▓  │  FILL     │
│         │  24:32    │           │  ← Time centered
│         │  ▓▓▓▓▓▓▓  │           │
│         └───────────┘           │
│                                 │
│   [5min] [15min] [25min] [45min]│  ← Preset pills
│                                 │
│         [↺]  [▶ Start]          │  ← Reset + Start/Pause
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🧑‍💻 Imagine someone sitting  ││  ← Body double card
│  │    beside you. You're not    ││
│  │    alone right now.          ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ Finished? Log what you did  ││  ← Session log (optional)
│  └─────────────────────────────┘│
│                                 │  ← Safe area + tab bar
└─────────────────────────────────┘
```

---

## Water Timer — Exact Spec

```
Container:
  Size:           220x220px
  Border Radius:  110px (full circle)
  Border:         3px solid #7C3AED
  Background:     #1A1A2E
  Overflow:       hidden

Water Fill (Animated.View):
  Position:       absolute, bottom: 0, left: 0, right: 0
  Background:     linear-like gradient #7C3AED → #A855F7 (top of fill)
  Actually use:   solid #7C3AED40 for the fill body
  Top edge:       animated wavy line (separate SVG/canvas layer)
  Opacity:        0.5 on fill body, 0.8 on wave

Wave animation:
  Use:            SVG path or react-native-svg
  Motion:         horizontal sine wave scrolling left continuously
  Speed:          2s per full cycle (looping)
  Amplitude:      8px
  Color:          #7C3AED80

Time Text (centered, over fill):
  Font:           48px, 700, #F1F5F9
  Shadow:         text shadow for readability over water
    textShadowColor: '#00000080'
    textShadowOffset: { width: 0, height: 1 }
    textShadowRadius: 4

State indicators:
  Below time: small label
    Running: "● recording" — 11px, #10B981 (pulsing dot)
    Paused:  "⏸ paused" — 11px, textMuted
    Done:    "✓ done!" — 11px, #10B981

Glow ring (when running):
  shadowColor: #7C3AED
  shadowOffset: { width: 0, height: 0 }
  shadowOpacity: 0.6
  shadowRadius: 24
```

---

## Preset Pills — Exact Spec

```
Row: centered, gap 10px
Each pill:
  Padding:        10px 20px
  Border Radius:  100px
  Background:     #1A1A2E (unselected) / #7C3AED (selected)
  Border:         1px solid #2D2D4E (unselected) / none (selected)
  Text:           14px, 600, textSecondary (unselected) / white (selected)
  Transition:     background + text color, 150ms

Options: 5 min / 15 min / 25 min / 45 min
Default selected: 25 min (Pomodoro standard)
```

---

## Controls — Exact Spec

```
Row: centered, gap 20px, aligned center

Reset button:
  Size:           52x52px
  Border Radius:  26px (circle)
  Background:     #1A1A2E
  Border:         1px solid #2D2D4E
  Icon:           ↺ — 22px, textSecondary
  Disabled when: timer hasn't started

Start / Pause button:
  Size:           auto, height 56px, min-width 160px
  Border Radius:  28px (pill)
  Padding:        0 40px

  START state:
    Background:   #7C3AED
    Text:         "▶  Start" — 17px, 700, white
    Shadow:       purple glow

  PAUSE state:
    Background:   #252540
    Border:       1px solid #475569
    Text:         "⏸  Pause" — 17px, 700, textSecondary

On complete (timer hits 0):
  1. Haptic: notificationAsync SUCCESS
  2. Lottie overlay: timer-complete.json (stars/sparkles, 2s)
  3. Button changes to "✓ Done! Start again?" 
  4. Water fill: bounces from full → settles
```

---

## Body Double Card — Exact Spec

```
Background:     #1A1A2E
Border:         1px solid #2D2D4E
Border Radius:  16px
Padding:        20px
Width:          100%

Left:           body-double illustration (64x64px)
Right:
  Title:        "You're not working alone" — 15px, 600, textPrimary
  Body:         Rotating messages (changes each session):
    - "Imagine someone sitting quietly beside you. Working. Focused."
    - "Millions of ADHD brains are working right now. You're one of them."
    - "The people at coffee shops? They're your body doubles today."
    - "You showed up. That's already the hardest part."
  Font:         13px, 400, textSecondary, lineHeight: 20
```

---

## Timer Complete Flow

```
1. Timer reaches 0:00
2. Haptic: heavy success pulse (3 taps)
3. Lottie: stars burst from timer circle center (2s, auto-dismiss)
4. Water fill: animated wave celebration (bounces rapidly 3x)
5. Text changes: "⏱ 25 minutes focused. That's real." — 16px, success color
6. Button: "Start another" appears
7. Optional bottom sheet: "What did you complete?" (logs to Wins)
```

---

## Assets Required for This Screen

| Asset                   | File                                    | Size / Type |
|------------------------|------------------------------------------|-------------|
| Body double illustration| assets/illustrations/body-double.png    | 128x128px @3x |
| Timer complete anim    | assets/animations/timer-complete.json   | Lottie      |
| Water wave SVG         | assets/svg/wave.svg                     | SVG path    |

See ASSETS_MANIFEST.md for generation prompts.
