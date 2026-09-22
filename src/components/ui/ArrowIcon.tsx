import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type ArrowIconProps = {
  size?: number;
  color?: string;
  /** 'right' (default) or 'left' — used for forward/back nav affordances. */
  direction?: 'left' | 'right';
};

/**
 * Simple arrow glyph for directional nav affordances (onboarding next/back,
 * step wizards). Traced at a 20x20 viewBox to match the Frame nodes in the
 * Brand Guide rather than pulling in an icon-font dependency for one glyph.
 */
export const ArrowIcon = memo(function ArrowIcon({
  size = 20,
  color = '#0F3D34',
  direction = 'right',
}: ArrowIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      style={direction === 'left' ? { transform: [{ scaleX: -1 }] } : undefined}>
      <Path d="M4 10H16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path
        d="M11 5L16 10L11 15"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
