import { memo } from 'react';
import Svg, { Line, Path } from 'react-native-svg';

export type FlagIconProps = {
  size?: number;
  color?: string;
};

/** Flag glyph — report an issue row. */
export const FlagIcon = memo(function FlagIcon({ size = 22, color = '#0A2621' }: FlagIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1={4} y1={22} x2={4} y2={4} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});
