/** Vyaam spacing scale — Brand Guide section 10 Tokens, 4px grid. */
export const Spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16, // screen edge padding
  s5: 20, // between cards
  s6: 24, // between cards
  s7: 28, // between cards
  s8: 32, // between sections
  s10: 40, // between sections
} as const;

export type SpacingToken = keyof typeof Spacing;
