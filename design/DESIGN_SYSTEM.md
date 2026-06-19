# Focus Flow — Design System

## Philosophy
ADHD brains need: low visual noise, high contrast on what matters NOW,
dopamine rewards that feel earned, and zero overwhelm.
Every design decision must serve one of these four goals.

---

## Typography
All iOS — use SF Pro (system font, no import needed)

| Role            | Size | Weight | Color          |
|----------------|------|--------|----------------|
| Screen Title   | 32px | 700    | #F1F5F9        |
| Section Label  | 12px | 800    | slot color     |
| Body / Task    | 16px | 500    | #F1F5F9        |
| Subtitle       | 14px | 400    | #94A3B8        |
| Caption / Muted| 12px | 400    | #475569        |
| Big Number     | 72px | 800    | #F1F5F9        |
| Timer Display  | 48px | 700    | #F1F5F9        |

---

## Color System

### Backgrounds
| Token          | Hex       | Usage                        |
|----------------|-----------|------------------------------|
| background     | #0F0F1A   | Screen background            |
| surface        | #1A1A2E   | Cards, inputs, bottom sheet  |
| surfaceHigh    | #252540   | Elevated cards, selected     |
| border         | #2D2D4E   | Dividers, card borders       |

### Brand
| Token          | Hex       | Usage                        |
|----------------|-----------|------------------------------|
| primary        | #7C3AED   | Buttons, NOW slot, accents   |
| primaryLight   | #A855F7   | Active tab, highlights       |
| primaryGlow    | #7C3AED26 | Glow shadows (15% opacity)   |

### Semantic
| Token          | Hex       | Usage                        |
|----------------|-----------|------------------------------|
| slotNow        | #7C3AED   | NOW section                  |
| slotNext       | #2563EB   | NEXT section                 |
| slotLater      | #475569   | LATER section                |
| success        | #10B981   | Completions, streak active   |
| danger         | #EF4444   | Drop / delete                |
| warning        | #F59E0B   | Streak warning, alerts       |

### Text
| Token          | Hex       | Usage                        |
|----------------|-----------|------------------------------|
| textPrimary    | #F1F5F9   | All main text                |
| textSecondary  | #94A3B8   | Supporting text              |
| textMuted      | #475569   | Placeholders, captions       |

---

## Spacing
4px grid. Common values: 4, 8, 12, 16, 20, 24, 32, 40, 48

---

## Border Radius
| Element        | Radius |
|----------------|--------|
| Card           | 16px   |
| Button (large) | 16px   |
| Button (pill)  | 100px  |
| Tag / Badge    | 8px    |
| Input          | 14px   |
| Bottom Sheet   | 24px top corners |

---

## Shadows (iOS)
```
shadowColor: '#7C3AED'
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.25
shadowRadius: 12
```
Only use purple glow shadow on the primary CTA button and active NOW tasks.

---

## Slot Visual Language

### NOW — "Do this right now"
- Left border: 3px solid #7C3AED
- Card bg: surface with purple left accent
- Label: "⚡ NOW" in #7C3AED, 800 weight, 11px, letter-spacing 2
- Checkbox border: #7C3AED
- Glow effect behind card: primaryGlow

### NEXT — "Coming up"
- Left border: 3px solid #2563EB
- Label: "👉 NEXT" in #2563EB
- Checkbox border: #2563EB
- No glow — less urgency

### LATER — "Not yet"
- Left border: 3px solid #475569
- Label: "🌙 LATER" in #475569
- Checkbox border: #475569
- Slightly lower opacity on text (0.7)

---

## Animation Principles
- Task completion: spring bounce + scale 1.0 → 1.15 → 1.0 (120ms)
- Card entry: fade + slide up 8px (200ms)
- Slot change: cross-fade (150ms)
- Timer fill: easing in-out, matches real seconds
- Celebration: Lottie overlay, 1.5s, auto-dismiss
- Energy selection: border + bg color transition (200ms ease)
- "Got distracted" button: subtle pulse animation to invite tap

---

## Component Rules

### Task Card
- Min height: 56px
- Checkbox: 24x24, rounded 6px, 2px border, filled on complete
- On complete: strikethrough text + slide-out right (300ms)
- Swipe left → delete (red background reveals)
- Swipe right → move to next slot

### Bottom Sheet (Add Task)
- Drag handle: 40x4px, centered, #2D2D4E
- Opens with spring from bottom
- Keyboard aware (shifts up with keyboard)
- Dismisses on swipe down or tap outside

### Energy Cards (Onboarding)
- Full width, 80px tall min
- Illustration: 48x48 left
- Title + description right
- Selected: 2px border primary + surfaceHigh bg
- Unselected: 1px border border color + surface bg
- Tap: scale 0.97 → 1.0 (spring, 80ms)
