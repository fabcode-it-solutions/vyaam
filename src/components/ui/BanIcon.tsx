import { memo } from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

export type BanIconProps = {
  size?: number;
  color?: string;
};

/** No-entry glyph — blocked-users rows. */
export const BanIcon = memo(function BanIcon({ size = 22, color = '#0A2621' }: BanIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
      <Line x1={5.8} y1={5.8} x2={18.2} y2={18.2} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});
