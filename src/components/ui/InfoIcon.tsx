import { memo } from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

export type InfoIconProps = {
  size?: number;
  color?: string;
};

/** Info glyph — about & legal row. */
export const InfoIcon = memo(function InfoIcon({ size = 22, color = '#0A2621' }: InfoIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
      <Line x1={12} y1={16} x2={12} y2={12} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={12} cy={8} r={1} fill={color} />
    </Svg>
  );
});
