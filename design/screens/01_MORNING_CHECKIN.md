# Screen 01 — Morning Check-In

## Purpose
First thing the user sees every day. Must feel warm, quick, and non-overwhelming.
3 taps max to get to their day. Zero friction.

---

## Layout (top → bottom)

```
┌─────────────────────────────────┐
│                                 │  ← Safe area top
│  Good morning 👋                │  ← 32px, 700, textPrimary (dynamic: Good afternoon / evening)
│  How's your energy right now?   │  ← 16px, 500, textPrimary
│  I'll adjust your day for you   │  ← 14px, 400, textSecondary, 8px below
│                                 │
│  ┌─────────────────────────────┐│
│  │ [moon illus] Low energy     ││  ← Energy Card
│  │              Gentle day,    ││
│  │              essentials only││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ [flame illu] Medium energy  ││
│  │              Steady pace    ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ [bolt illus] High energy    ││
│  │              Full throttle  ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │      Let's start →          ││  ← CTA button, disabled until selection
│  └─────────────────────────────┘│
│                                 │  ← Safe area bottom
└─────────────────────────────────┘
```

---

## Energy Card — Exact Spec

```
Height:       88px
Padding:      20px horizontal, 20px vertical
Border Radius: 16px
Border:       1.5px solid #2D2D4E (unselected) / 2px solid #7C3AED (selected)
Background:   #1A1A2E (unselected) / #252540 (selected)
Gap between cards: 12px

LEFT:
  Illustration: 52x52px PNG with transparent background
  Margin right: 16px

RIGHT:
  Title: 17px, 600 weight, #F1F5F9
  Description: 13px, 400 weight, #94A3B8, 2px below title

SELECTED STATE:
  Left colored bar: 4px wide, full height, rounded right, color = slot color
  Border: 2px solid #7C3AED / #2563EB / #475569 (matches energy)
  Background: #252540
```

---

## CTA Button Spec

```
Height:       56px
Border Radius: 16px
Background:   #7C3AED (active) / #7C3AED40 (disabled)
Text:         "Let's start →" — 17px, 700, white
Disabled text: 40% opacity
Shadow (active only):
  shadowColor: #7C3AED
  shadowOffset: { width: 0, height: 8 }
  shadowOpacity: 0.4
  shadowRadius: 16
```

---

## Greeting Logic
```
5am - 11:59am  → "Good morning 👋"
12pm - 4:59pm  → "Good afternoon ☀️"
5pm - 8:59pm   → "Good evening 🌆"
9pm - 4:59am   → "Hey night owl 🦉"
```

---

## Assets Required for This Screen

| Asset                   | File                          | Size       |
|------------------------|-------------------------------|------------|
| Low energy illustration | assets/illustrations/energy-low.png    | 104x104px @3x |
| Medium energy illustration | assets/illustrations/energy-medium.png | 104x104px @3x |
| High energy illustration | assets/illustrations/energy-high.png   | 104x104px @3x |

See ASSETS_MANIFEST.md for AI generation prompts.
