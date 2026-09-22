/**
 * Vyaam type scale — Brand Guide section 04 Typography.
 * Plus Jakarta Sans throughout; Noto Sans Devanagari loads only for Hindi
 * (not wired up yet — see Known open items in CLAUDE.md).
 *
 * Rules from the guide:
 * - Sentence case everywhere, including buttons and tabs. Never Title Case.
 * - Only three weights ship in the app: 400 / 600 / 700. 800 is H1-only.
 * - Negative tracking on large text, none below 20px, positive only on
 *   uppercase H6.
 * - All metrics/weights/calories/prices/timers/counters use tabular figures
 *   (`fontVariant: ['tabular-nums']`) so digits don't jitter as they change.
 */

import type { TextStyle } from 'react-native';

export const FontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

type TypeStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: 'uppercase';
};

export const Typography = {
  h1: {
    fontFamily: FontFamily.extraBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -1.1,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.7,
  },
  h3: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  h4: {
    fontFamily: FontFamily.semiBold,
    fontSize: 17,
    lineHeight: 24,
  },
  h5: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    lineHeight: 22,
  },
  h6: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    lineHeight: 26,
  },
  bodySecondary: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  caption: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    lineHeight: 17,
  },
} satisfies Record<string, TypeStyle>;

export type TypographyVariant = keyof typeof Typography;

/** Apply to any numeral-bearing Text (metrics, prices, timers, counters). */
export const tabularNums: TextStyle = { fontVariant: ['tabular-nums'] };
