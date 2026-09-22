import { memo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { lightPalette, useTheme } from '@/theme';

export type LogoMarkProps = {
  size?: number;
  /** Overrides colors.onBrand — use when rendering on a surface the active theme doesn't own (e.g. the fixed-brand splash). */
  primaryColor?: string;
  /** Overrides colors.accent — see primaryColor. */
  accentColor?: string;
  /**
   * Wrap the mark in its rounded ink tile (Figma node 227:574's baked-in
   * background) — the small header lockup used on auth/onboarding screens,
   * as opposed to the bare mark used inside the splash's own lockup. Always
   * renders the fixed brand tile colours (ink/sand/saffron), never the
   * active theme, regardless of `primaryColor`/`accentColor`.
   */
  tile?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Vyaam logo mark — Brand Guide "Logo Mark" component (Figma node 24:9): a
 * running figure, head + trailing leg in the primary colour, leading leg in
 * saffron. Traced from the exported vector at its native 64x64 viewBox so it
 * stays crisp at any rendered size instead of shipping a raster.
 */
export const LogoMark = memo(function LogoMark({
  size = 64,
  primaryColor,
  accentColor,
  tile = false,
  style,
}: LogoMarkProps) {
  const { colors } = useTheme();
  const primary = tile ? lightPalette.sand : primaryColor ?? colors.onBrand;
  const accent = tile ? lightPalette.saffron : accentColor ?? colors.accent;
  const markSize = tile ? size * 0.62 : size;

  const mark = (
    <Svg width={markSize} height={markSize} viewBox="0 0 64 64" fill="none">
      <Path
        d="M32 23.5C35.0376 23.5 37.5 21.0376 37.5 18C37.5 14.9624 35.0376 12.5 32 12.5C28.9624 12.5 26.5 14.9624 26.5 18C26.5 21.0376 28.9624 23.5 32 23.5Z"
        fill={primary}
      />
      <Path d="M17 45L32 30" stroke={primary} strokeWidth={7} strokeLinecap="round" />
      <Path d="M32 30L47 45" stroke={accent} strokeWidth={7} strokeLinecap="round" />
    </Svg>
  );

  if (!tile) {
    return mark;
  }

  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size * (6 / 44), backgroundColor: lightPalette.ink },
        style,
      ]}>
      {mark}
    </View>
  );
});

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
