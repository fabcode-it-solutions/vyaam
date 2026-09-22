import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type MinusIconProps = {
  size?: number;
  color?: string;
};

/** Minus glyph — quantity stepper decrement (Figma node 152:497). */
export const MinusIcon = memo(function MinusIcon({ size = 14, color = '#0A2621' }: MinusIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M2.91667 7H11.0833" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
});
