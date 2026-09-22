import { buildElevation } from './elevation';
import { darkColors, lightColors } from './colors';
import { Radius } from './radius';
import { Spacing } from './spacing';
import { Typography } from './typography';

function buildTheme(mode: 'light' | 'dark') {
  const colors = mode === 'light' ? lightColors : darkColors;
  return {
    mode,
    colors,
    typography: Typography,
    spacing: Spacing,
    radius: Radius,
    elevation: buildElevation(colors),
  };
}

export const lightTheme = buildTheme('light');
export const darkTheme = buildTheme('dark');

export type Theme = typeof lightTheme;
