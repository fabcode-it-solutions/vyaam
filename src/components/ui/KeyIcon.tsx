import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type KeyIconProps = {
  size?: number;
  color?: string;
};

/** Key glyph — two-factor authentication row (Account settings). */
export const KeyIcon = memo(function KeyIcon({ size = 22, color = '#0A2621' }: KeyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={8} cy={15.5} r={4} stroke={color} strokeWidth={2} />
      <Path
        d="M11 12.5 19.5 4M16.5 7 19 4.5M19 9 21 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
