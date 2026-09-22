import { memo } from 'react';
import Svg, { Line, Rect } from 'react-native-svg';

export type CardIconProps = {
  size?: number;
  color?: string;
};

/** Credit-card glyph — payment methods row. */
export const CardIcon = memo(function CardIcon({ size = 22, color = '#0A2621' }: CardIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={5} width={20} height={14} rx={2} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Line x1={2} y1={10} x2={22} y2={10} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});
