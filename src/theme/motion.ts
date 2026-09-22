import { Easing } from 'react-native-reanimated';

/** Vyaam motion tokens — Brand Guide section 10 Tokens. */
export const Motion = {
  /** Presses, toggles. */
  fast: 120,
  /** Sheets, expands. */
  base: 200,
  /** Screen transitions. */
  slow: 320,
} as const;

/** cubic-bezier(.2, 0, 0, 1) — respect the OS reduce-motion setting before using this. */
export const easing = Easing.bezier(0.2, 0, 0, 1);

/**
 * Celebration animations on streaks and completed sessions are the one place
 * the guide says to spend extra motion budget; everything else should stay
 * quick and unremarkable.
 */
