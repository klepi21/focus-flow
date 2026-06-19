// ADHD-optimized palette: ice-white base, pistachio green, warm terracotta, calm sky blue
// Research: greens enhance reading/focus, soft blues lower anxiety, warm earth tones ground
// 60% background neutrals / 30% pistachio / 10% slot accents

export const Colors = {
  // ── Backgrounds ─────────────────────────────────────────
  // Ice white with faint green warmth — reduces glare vs pure white
  background: '#F3F7F4',
  backgroundDeep: '#E8F0EA',    // modals / bottom sheets
  surface: '#FFFFFF',
  surfaceHigh: '#F7FAF7',
  surfacePress: '#EFF5F0',

  // ── Glass (light-mode frosted cards) ────────────────────
  glass: 'rgba(255,255,255,0.80)',
  glassBorder: 'rgba(27,42,29,0.08)',
  glassBorderStrong: 'rgba(27,42,29,0.15)',

  // ── Brand — Pistachio Green ──────────────────────────────
  // Pistachio: fresh, natural, focus-positive without overstimulating
  primary: '#6FB040',
  primaryLight: '#8DC95A',
  primaryDeep: '#508A2A',
  primaryGlow: 'rgba(111,176,64,0.22)',

  // ── Task Slots ───────────────────────────────────────────
  // NOW: warm terracotta — urgency without the alarm of red
  now: '#D4703A',
  nowGlow: 'rgba(212,112,58,0.22)',
  // NEXT: calm sky blue — clarity, upcoming, non-anxious
  next: '#4B8EC8',
  nextGlow: 'rgba(75,142,200,0.22)',
  // LATER: muted sage/teal — receding, low cognitive load
  later: '#7FA899',
  laterGlow: 'rgba(127,168,153,0.18)',

  // ── Energy Auras (ambient background blobs) ──────────────
  auraLow: '#B8D9CC',
  auraLowSecondary: '#D0EAE0',
  auraMedium: '#A8D47A',
  auraMediumSecondary: '#C4E89A',
  auraHigh: '#F4B06A',
  auraHighSecondary: '#E8845A',

  // ── Status ──────────────────────────────────────────────
  success: '#4A9E5C',
  successGlow: 'rgba(74,158,92,0.22)',
  warning: '#E09A2B',
  warningGlow: 'rgba(224,154,43,0.22)',
  danger: '#D95454',
  dangerGlow: 'rgba(217,84,84,0.22)',

  // ── Text (dark on light) ────────────────────────────────
  // Near-black with green undertone — warmer than pure #000, easier on ADHD eyes
  textPrimary: '#1B2A1D',
  textSecondary: 'rgba(27,42,29,0.58)',
  textMuted: 'rgba(27,42,29,0.38)',

  // ── Borders ─────────────────────────────────────────────
  border: 'rgba(27,42,29,0.08)',
  borderStrong: 'rgba(27,42,29,0.16)',

  // ── Misc ────────────────────────────────────────────────
  white: '#FFFFFF',
  accent: '#E09A2B',
};
