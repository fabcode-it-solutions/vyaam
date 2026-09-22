/**
 * Vyaam colour tokens.
 *
 * Light values are literal, pulled from the Brand Guide (Figma file
 * `XGneuIxWiSwOptsUsmA4Mh`, "Brand Guide" page, sections 03 Colour / 03.2
 * Colour in use) — do not hand-edit without checking that page first.
 *
 * Dark values: the Brand Guide explicitly flags dark mode as an open
 * decision ("Tokens defined here, theme not yet designed"). Only four raw
 * values are literal there — sand, white-surface, the interactive ink
 * (inverts to a light mint), and saffron (lightens). Every other dark value
 * below is an APPROXIMATION that preserves hue/warmth per the guide's rule
 * ("never simply invert — the warm neutrals must stay warm"), not a design
 * sign-off. Revisit when Design ships a real dark pass.
 */

export const lightPalette = {
  ink: '#0F3D34',
  inkDeep: '#0A2621',
  saffron: '#E8762C',
  saffronDeep: '#8C4212',
  saffronTint: '#FDEEE2',

  sand: '#FAF7F0',
  white: '#FFFFFF',
  line: '#E3DFD4',
  muted: '#6E7B76',
  body: '#4A5A55',

  verified: '#17765A',
  verifiedTint: '#E2F1EC',
  warning: '#C77D0A',
  warningTint: '#FBF0DC',
  danger: '#B3261E',
  dangerTint: '#FBE9E7',
  info: '#2C6E9B',
  infoTint: '#E7F0F7',

  focusRing: '#DDEAE5',
} as const;

/** [approximated] — see file header. Only sand/white/ink/saffron are literal from the guide. */
export const darkPalette = {
  ink: '#7FC9AE', // literal — "interactive text inverts to a light mint"
  inkDeep: '#EAF3EF', // [approximated] near-white, mint-tinted, for headings on dark
  saffron: '#F79448', // literal — "saffron lightens to hold contrast on dark"
  saffronDeep: '#F79448', // [approximated] guide only defines one lightened saffron value
  saffronTint: '#3A2415', // [approximated] dark saffron-tinted surface

  sand: '#12100D', // literal
  white: '#1C1A16', // literal — "white surfaces become #1C1A16"
  line: '#2B2822', // [approximated] warm dark divider
  muted: '#8A9490', // [approximated]
  body: '#C7D3CC', // [approximated]

  verified: '#2FAE86', // [approximated]
  verifiedTint: '#123028', // [approximated]
  warning: '#E0A23C', // [approximated]
  warningTint: '#3A2C10', // [approximated]
  danger: '#E2564A', // [approximated]
  dangerTint: '#3A1613', // [approximated]
  info: '#5AA3D6', // [approximated]
  infoTint: '#132A38', // [approximated]

  focusRing: '#2F5A4E', // [approximated]
} as const;

/**
 * Semantic roles used by components — always read colour through these, never
 * through `lightPalette`/`darkPalette` directly, so light/dark stay in sync.
 *
 * Contrast notes carried over from the guide (03.2 Colour in use), measured
 * against sand/white/ink/saffron respectively:
 * - textPrimary on background: 15.8:1 — pass any size
 * - textSecondary on background: 6.6:1 — pass any size
 * - textMuted on background: 4.1:1 — large text only, 13px minimum, never body copy
 * - onBrand on brand: 11.3:1 — pass
 * - white text on saffron: 2.98:1 — FAILS. Accent surfaces always use onAccent, never white.
 * - onAccent (ink) on accent: 5.4:1 — pass
 * - accentDeep on white: 7.3:1 — pass
 * - white on verified: 5.5:1 / white on danger: 6.7:1 — pass
 * - white on warning: 3.3:1 — FAILS. Warning is always tint-background + deep text, never solid+white.
 */
function buildColors(p: Record<keyof typeof lightPalette, string>) {
  return {
    background: p.sand,
    surface: p.white,
    border: p.line,

    textPrimary: p.inkDeep,
    textSecondary: p.body,
    textMuted: p.muted,

    brand: p.ink,
    onBrand: p.sand,

    accent: p.saffron,
    accentDeep: p.saffronDeep,
    accentTint: p.saffronTint,
    onAccent: p.inkDeep,

    verified: p.verified,
    verifiedTint: p.verifiedTint,
    onVerified: p.white,

    warning: p.warning,
    warningTint: p.warningTint,
    onWarningTint: p.warning,

    danger: p.danger,
    dangerTint: p.dangerTint,
    onDanger: p.white,

    info: p.info,
    infoTint: p.infoTint,
    onInfoTint: p.info,

    focusRing: p.focusRing,
  } as const;
}

export const lightColors = buildColors(lightPalette);
export const darkColors = buildColors(darkPalette);

export type Colors = typeof lightColors;
