# Screen 02 — Today (Main Screen)

## Purpose
The most important screen. The user spends 80% of their time here.
Must show ONLY what matters NOW. Everything else fades into the background.
The NOW slot must visually dominate. LATER must visually recede.

---

## Layout (top → bottom)

```
┌─────────────────────────────────┐
│                                 │  ← Safe area top
│  Thursday, Jun 19    [🔥 5]    │  ← Date left, streak badge right
│  ⚡ Medium energy day           │  ← Energy reminder, 13px, textSecondary
│                                 │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│  ← Thin divider #2D2D4E
│                                 │
│  ⚡ NOW          do this first  │  ← Section header
│  ┌──────────────────────────┐   │
│  │▌ [ ] Write email to Sara  │   │  ← Task card, purple left bar
│  │▌ 15 min              [×]  │   │
│  └──────────────────────────┘   │
│  + Add task                     │  ← Ghost button
│                                 │
│  👉 NEXT         up next        │  ← Section header
│  ┌──────────────────────────┐   │
│  │▌ [ ] Review pull request  │   │  ← Task card, blue left bar
│  └──────────────────────────┘   │
│                                 │
│  🌙 LATER        not yet        │  ← Section header, muted
│  ┌──────────────────────────┐   │
│  │▌ [ ] Call dentist         │   │  ← Task card, gray, slightly faded
│  └──────────────────────────┘   │
│                                 │
│  😵 I got distracted            │  ← Bottom soft button
│                                 │  ← Safe area bottom + tab bar
└─────────────────────────────────┘
```

---

## Header Bar — Exact Spec

```
Date text:      22px, 700, textPrimary
Energy line:    13px, 400, textSecondary, emoji + text
Streak badge:
  Background:   #1A1A2E
  Border:       1px solid #2D2D4E
  Border Radius: 12px
  Padding:       8px 14px
  Flame emoji:   18px
  Number:        20px, 700, textPrimary
  Layout:        emoji on top of number, centered column
```

---

## Section Header — Exact Spec

```
Row layout: [dot 8px] [LABEL] [spacer] [description text]

NOW:
  Dot color:    #7C3AED
  Label:        "⚡ NOW" — 11px, 800, #7C3AED, letter-spacing: 2px
  Description:  "do this first" — 11px, 400, #475569

NEXT:
  Dot color:    #2563EB
  Label:        "👉 NEXT" — 11px, 800, #2563EB
  Description:  "up next" — 11px, 400, #475569

LATER:
  Dot color:    #475569
  Label:        "🌙 LATER" — 11px, 800, #475569
  Description:  "not yet" — 11px, 400, #475569
  Opacity:      0.7 on entire section (visual de-emphasis)
```

---

## Task Card — Exact Spec

```
Height:         min 56px (grows with long titles)
Border Radius:  12px
Background:     #1A1A2E
Left bar:       3px wide, full height, rounded 2px, color = slot color
Padding:        16px right, 16px vertical, 16px left (after bar)
Margin bottom:  8px

LEFT BAR COLORS:
  NOW:  #7C3AED
  NEXT: #2563EB
  LATER:#475569

CHECKBOX (left of title):
  Size:         24x24px
  Border Radius: 6px
  Border:       2px solid (slot color)
  Fill on complete: slot color
  Checkmark:    white, 12px ✓

TITLE:
  Font:         16px, 500, textPrimary
  Flex:         1 (fills remaining space)
  On complete:  color → textMuted, text-decoration: line-through

TIME TAG (optional, right of title):
  Background:   #252540
  Border Radius: 6px
  Padding:      4px 8px
  Text:         12px, 500, textMuted
  Shows:        "15 min"

DELETE BUTTON (far right):
  Size:         24x24px tap target
  Icon:         × symbol, 18px, textMuted
  On press:     slide card out to right (200ms) + haptic medium

SWIPE LEFT → DELETE:
  Red background (#EF4444) reveals with trash icon
  Full swipe → removes card + haptic heavy

SWIPE RIGHT → PROMOTE:
  Moves to slot above (LATER→NEXT→NOW)
  Slot color background reveals with ↑ arrow icon
  Haptic light
```

---

## Empty Slot State

```
Background:   #1A1A2E
Border:       1px dashed #2D2D4E
Border Radius: 12px
Height:       56px
Content:      centered "＋ Add your first task" — 14px, textMuted
```

---

## "Add another" Ghost Link

```
Text:    "＋ Add another"
Font:    13px, 400, textMuted
Padding: 8px top, 4px left
```

---

## "I Got Distracted" Button

```
Background:     #1A1A2E
Border:         1px solid #2D2D4E
Border Radius:  14px
Height:         52px
Text:           "😵 I got distracted — reset & refocus"
Font:           14px, 400, textSecondary
Animation:      subtle pulse every 8 seconds to invite tap
                (scale 1.0 → 1.02 → 1.0, opacity 1.0 → 0.8 → 1.0)

On press:
  1. Haptic light
  2. Bottom sheet slides up with:
     - "Take a breath. 🌬️" title
     - "What pulled you away?" (optional text field)
     - "I'm back. Let's go." button → haptic success + dismiss
```

---

## Floating Add Button (FAB)

```
Position:       bottom right, 24px from edges, above tab bar
Size:           56x56px
Border Radius:  28px (circle)
Background:     #7C3AED
Shadow:
  shadowColor: #7C3AED
  shadowOffset: { width: 0, height: 8 }
  shadowOpacity: 0.5
  shadowRadius: 16
Icon:           "＋" — 28px, white, 300 weight

On press:
  Scale: 1.0 → 0.9 → 1.0 (spring, 80ms)
  Opens: Add Task bottom sheet
```

---

## Task Completion Flow

```
1. User taps checkbox
2. Instant: checkbox fills with slot color + white checkmark
3. 80ms: title gets strikethrough
4. 120ms: Lottie confetti plays (1.2s, auto-dismiss)
5. 300ms: card slides out to right with fade
6. Simultaneously: "Completed!" toast appears top-center (1.5s)
7. If NOW slot empties: auto-promotes first NEXT task to NOW
   with animation (card slides up + color transition)
```

---

## Assets Required for This Screen

| Asset                    | File                                   | Size        |
|--------------------------|----------------------------------------|-------------|
| Task complete confetti   | assets/animations/task-complete.json   | Lottie      |
| Empty state illustration | assets/illustrations/empty-tasks.png   | 200x160px @3x |
| "Got distracted" sheet bg| (color only, no image)                | —           |

See ASSETS_MANIFEST.md for generation prompts.
