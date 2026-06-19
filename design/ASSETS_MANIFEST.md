# Assets Manifest — Focus Flow

Every asset the app needs, with exact AI prompts and which tool to use.
After generating, run through remove.bg if background isn't transparent.
Export all illustrations at @3x (3x the display size).

---

## TOOL LEGEND

| Tool              | Best for                                          | URL                        |
|-------------------|---------------------------------------------------|----------------------------|
| Midjourney v6     | Rich illustrations, characters, complex scenes    | midjourney.com             |
| Adobe Firefly     | Commercial-safe, clean flat UI illustrations      | firefly.adobe.com          |
| DALL-E 3          | Quick iterations, consistent style matching       | chat.openai.com            |
| LottieFiles       | Pre-made Lottie animations (search + download)    | lottiefiles.com            |
| Rive              | Custom interactive animations                     | rive.app                   |
| remove.bg         | Clean background removal from any image           | remove.bg                  |
| vectorizer.ai     | Convert PNG illustration to SVG                   | vectorizer.ai              |
| Canva             | App icon, badge, simple graphic assets            | canva.com                  |
| Jitter            | UI micro-animations (export as Lottie)            | jitter.video               |

---

## STYLE REFERENCE (use in ALL Midjourney/Firefly/DALL-E prompts)

Always append this to every illustration prompt:
```
flat 2D illustration, bold clean lines, dark background compatible,
transparent background, soft glow effects, modern mobile app style,
color palette: deep purple #7C3AED, electric blue #2563EB, 
warm amber #F59E0B, dark background #0F0F1A, white highlights,
no text, no letters, no words
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SECTION 1 — APP ICON & SPLASH
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 1.1 — App Icon
```
File:     assets/icon.png
Size:     1024x1024px (App Store requirement)
Tool:     Canva (use their app icon maker) OR Midjourney

Midjourney prompt:
"minimalist mobile app icon, stylized brain with a lightning bolt 
through it, clean vector style, purple gradient background 
#7C3AED to #A855F7, white brain outline with electric spark,
rounded square shape, no text, ultra clean, modern iOS app icon style,
--v 6 --ar 1:1 --style raw"

Canva instructions:
1. Open Canva → "App Icon" template
2. Background: purple gradient (7C3AED → A855F7)
3. Add brain emoji or brain icon (white, centered)
4. Add small lightning bolt overlay (white/amber)
5. Export 1024x1024 PNG

Notes:
- Must be square, no alpha channel (App Store requirement)
- Corner radius is applied automatically by iOS
```

### 1.2 — Splash Screen
```
File:     assets/splash-icon.png
Size:     1284x2778px (largest iPhone size, scales down)
Tool:     Canva

Instructions:
1. Background: solid #0F0F1A
2. Center: same brain+lightning icon from 1.1, at 200x200px
3. Below icon: "focus flow" in white, 28px, thin weight (optional)
4. Export PNG

Notes:
- Expo uses this as the splash image with resizeMode: contain
- The background color (#0F0F1A) fills the rest
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SECTION 2 — ENERGY ILLUSTRATIONS
## (Morning Check-in Screen)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 2.1 — Low Energy Illustration
```
File:     assets/illustrations/energy-low.png
Display:  52x52px  →  Export: 156x156px @3x
Tool:     Adobe Firefly (first choice) OR Midjourney

Adobe Firefly prompt:
"cute small moon character, sleepy crescent moon with drowsy 
half-closed eyes, soft blue and purple glow, cozy and gentle feeling,
tiny sparkle stars around it, flat 2D illustration style,
transparent background, no text, dark-theme compatible,
simple and clean, rounded shapes"

Midjourney prompt:
"cute sleepy crescent moon character, half-closed eyes, soft 
purple-blue glow, tiny stars around, kawaii but minimal style,
flat vector illustration, transparent background, no text,
dark background compatible, --v 6 --ar 1:1 --style raw 
--no text, letters, background, shadows"

Post-process: remove.bg if background isn't transparent
```

### 2.2 — Medium Energy Illustration
```
File:     assets/illustrations/energy-medium.png
Display:  52x52px  →  Export: 156x156px @3x
Tool:     Adobe Firefly (first choice) OR Midjourney

Adobe Firefly prompt:
"cute small flame character, steady calm fire with a content 
neutral face, warm orange and amber colors #F59E0B, 
balanced and peaceful energy feeling, flat 2D illustration,
transparent background, no text, dark-theme compatible,
simple rounded shapes, soft warm glow"

Midjourney prompt:
"cute steady flame character, calm neutral face expression,
warm orange amber glow, balanced peaceful energy, minimal kawaii style,
flat vector illustration, transparent background, no text,
--v 6 --ar 1:1 --style raw --no background, text, letters"

NOTE: Must feel CALM not excited — this is medium energy, not high.
```

### 2.3 — High Energy Illustration
```
File:     assets/illustrations/energy-high.png
Display:  52x52px  →  Export: 156x156px @3x
Tool:     Adobe Firefly (first choice) OR Midjourney

Adobe Firefly prompt:
"cute electric lightning bolt character, energetic excited face,
bright purple and white electric sparks around it, 
electric energy feeling, radiating power lines, flat 2D illustration,
transparent background, no text, dark-theme compatible,
vibrant and bold, clean rounded shapes"

Midjourney prompt:
"cute electric lightning bolt character with excited face,
bright purple white electric sparks, radiating energy lines,
bold and vibrant, flat vector illustration, transparent background,
kawaii minimal style, --v 6 --ar 1:1 --style raw 
--no background, text, letters"
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SECTION 3 — EMPTY STATE ILLUSTRATIONS
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 3.1 — Empty Tasks State
```
File:     assets/illustrations/empty-tasks.png
Display:  200x160px  →  Export: 600x480px @3x
Tool:     Midjourney OR DALL-E 3

Description: Shows a friendly brain character looking at a blank 
to-do list / clipboard with question marks. Inviting and warm,
not anxious or overwhelming.

Midjourney prompt:
"cute friendly brain character looking at an empty clipboard with
a gentle curious expression, blank to-do list, small question marks
floating around, soft purple glow, encouraging and warm feeling,
flat 2D illustration, wide format, transparent background,
no text, dark-theme compatible, modern mobile app empty state style,
--v 6 --ar 5:4 --style raw"

DALL-E 3 prompt:
"A cute illustrated brain character with a friendly face looking 
at a blank clipboard checklist. The character looks curious and 
inviting, not stressed. Soft purple and blue tones, floating small 
question marks, flat 2D illustration style, transparent background, 
no words or text in the image, suitable for a dark-themed mobile app."
```

### 3.2 — Empty Wins State (no completions yet)
```
File:     assets/illustrations/empty-wins.png
Display:  200x160px  →  Export: 600x480px @3x
Tool:     Midjourney OR DALL-E 3

Description: A sleeping/resting trophy or medal, with small "zzz"
bubbles. Feels encouraging — "your wins will appear here", not sad.

Midjourney prompt:
"cute illustrated golden trophy character taking a nap, small 
zzz bubbles floating up, stars and sparkles around it, soft warm 
golden glow, encouraging and cozy feeling, flat 2D illustration,
wide format, transparent background, no text,
dark-theme compatible, --v 6 --ar 5:4 --style raw"
```

### 3.3 — All Done / Day Complete State
```
File:     assets/illustrations/day-complete.png
Display:  200x160px  →  Export: 600x480px @3x
Tool:     Midjourney

Description: A cheerful brain character wearing a tiny graduation cap
or crown, confetti around it, triumphant pose. Used when all tasks done.

Midjourney prompt:
"cute happy brain character wearing a tiny golden crown, 
celebration confetti raining around it, triumphant happy pose,
rainbow sparkles, gold and purple colors, soft glow,
flat 2D illustration, wide format, transparent background, no text,
dark-theme compatible, joyful energetic feeling,
--v 6 --ar 5:4 --style raw"
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SECTION 4 — FOCUS SCREEN ILLUSTRATIONS
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 4.1 — Body Double Illustration
```
File:     assets/illustrations/body-double.png
Display:  64x64px  →  Export: 192x192px @3x
Tool:     Adobe Firefly OR Midjourney

Description: A small, simple silhouette of a person sitting at a desk,
working. Should feel calm and companionable. NOT detailed —
just a warm presence.

Adobe Firefly prompt:
"minimal cute illustration of a small person silhouette sitting
at a desk working on a laptop, soft warm glow around them,
cozy focused atmosphere, simple and clean, flat 2D style,
purple and blue tones, transparent background, no text,
dark-theme compatible"

Midjourney prompt:
"minimalist cute person silhouette sitting at desk working,
warm purple blue ambient glow, cozy productive atmosphere,
flat 2D illustration, small square format, transparent background,
no text, no face detail needed, --v 6 --ar 1:1 --style raw"
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SECTION 5 — LOTTIE ANIMATIONS
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 5.1 — Task Complete Celebration
```
File:     assets/animations/task-complete.json
Duration: 1.2 seconds
Tool:     LottieFiles.com (search + download FREE)

What to search on LottieFiles:
  Search: "confetti celebration purple"
  OR:     "checkmark success confetti"
  OR:     "task done celebration"

Filter: Free only, Loop: No (plays once)
Style:  colorful confetti burst, NOT minimal checkmark only

If nothing fits — use Jitter:
  1. jitter.video → new project
  2. Create: circles bursting outward from center, 
     colorful dots in purple/blue/amber/green
  3. Duration: 1.2s
  4. Export as Lottie JSON

Color palette for animation:
  #7C3AED (purple), #2563EB (blue), #10B981 (green),
  #F59E0B (amber), #EC4899 (pink), white

Usage in code: plays as overlay on top of task card when completed,
auto-dismisses after 1.2s, centered on screen
```

### 5.2 — Timer Complete Celebration
```
File:     assets/animations/timer-complete.json
Duration: 2.0 seconds
Tool:     LottieFiles.com

What to search:
  Search: "stars burst celebration"
  OR:     "sparkles explosion purple"
  OR:     "focus complete celebration"

Should feel: bigger than task-complete, more epic,
             stars and sparkles erupting outward

If nothing fits on LottieFiles — use Rive:
  rive.app → Community → search "celebration"
  Can export as Lottie-compatible format
```

### 5.3 — Streak Achievement
```
File:     assets/animations/streak.json
Duration: 2.5 seconds
Tool:     LottieFiles.com

What to search:
  Search: "fire flame celebration"
  OR:     "streak fire burst"
  OR:     "flame level up"

Plays when: streak milestone reached (3, 7, 14, 30 days)
Style:  fire/flame animation, warm colors, energetic
```

### 5.4 — "Got Distracted" Gentle Reset
```
File:     assets/animations/breathe.json
Duration: 4.0 seconds (loops)
Tool:     LottieFiles.com

What to search:
  Search: "breathing meditation calm"
  OR:     "inhale exhale animation"
  OR:     "mindfulness breathing circle"

Style:  expanding/contracting circle, calm, slow, soothing
Colors: soft blue/purple, NOT harsh red or warning colors
Plays:  on the "I got distracted" bottom sheet, looping
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SECTION 6 — ONBOARDING BACKGROUND
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 6.1 — Subtle Noise/Grain Texture (optional)
```
File:     assets/textures/noise.png
Size:     100x100px (tiles across background)
Tool:     Online noise generator

Instructions:
  1. Go to: transparenttextures.com
  2. Search: "noise" 
  3. Set opacity very low (5-8%)
  4. Download as PNG
  5. Use as background pattern overlay on #0F0F1A

This adds depth to the dark background without being obvious.
```

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SECTION 7 — TAB BAR ICONS
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Decision: Use Emoji vs Custom Icons

Option A — Emoji (current approach):
  ⚡ Today tab
  🎯 Focus tab  
  🏆 Wins tab
  
  Pros: no design work, universally understood
  Cons: can look unprofessional on some devices

Option B — Custom SVG Icons (recommended for final product):
```
Tool: Figma (free) + export as SVG
OR:   Phosphor Icons (phosphoricons.com) — free, beautiful set

Icons to use from Phosphor:
  Today:  "lightning" icon
  Focus:  "target" icon
  Wins:   "trophy" icon

Download SVG → convert to React Native SVG component
OR use @expo/vector-icons (Ionicons):
  Today:  "flash-outline" / "flash"
  Focus:  "timer-outline" / "timer"  
  Wins:   "trophy-outline" / "trophy"
```

**Recommendation: Start with emoji, switch to Ionicons once
the design feels right. Don't spend time on custom icons yet.**

---

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SECTION 8 — ASSET CHECKLIST
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Priority order (build in this order):

### P0 — Need before first TestFlight
- [ ] App icon (1024x1024)
- [ ] Splash screen
- [ ] energy-low.png
- [ ] energy-medium.png
- [ ] energy-high.png
- [ ] task-complete.json (Lottie)

### P1 — Need before beta launch
- [ ] empty-tasks.png
- [ ] empty-wins.png
- [ ] body-double.png
- [ ] timer-complete.json (Lottie)
- [ ] breathe.json (Lottie)

### P2 — Nice to have before App Store
- [ ] day-complete.png
- [ ] streak.json (Lottie)
- [ ] noise texture (optional)
- [ ] Custom tab icons (vs emoji)

---

## FOLDER STRUCTURE

```
assets/
├── icon.png                    ← App icon 1024x1024
├── splash-icon.png             ← Splash screen
├── favicon.png                 ← Web (already exists)
├── illustrations/
│   ├── energy-low.png
│   ├── energy-medium.png
│   ├── energy-high.png
│   ├── empty-tasks.png
│   ├── empty-wins.png
│   ├── day-complete.png
│   └── body-double.png
├── animations/
│   ├── task-complete.json
│   ├── timer-complete.json
│   ├── streak.json
│   └── breathe.json
├── svg/
│   └── wave.svg
└── textures/
    └── noise.png
```

---

## CONSISTENCY NOTES

When generating multiple illustrations, do them in ONE session
on the same tool. After you generate energy-low.png, use
"--sref [url of energy-low image]" in Midjourney to force
style consistency across energy-medium and energy-high.

In DALL-E 3: copy the exact same style description from your
first successful result and prepend it to every subsequent prompt.

In Adobe Firefly: use "Match style" feature with your first result.
