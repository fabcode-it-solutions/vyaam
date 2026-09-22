import { memo } from 'react';
import Svg, { G, Line, Rect } from 'react-native-svg';

export type RulerIconProps = {
  size?: number;
  color?: string;
};

/** Diagonal ruler glyph — BMI calculator card. */
export const RulerIcon = memo(function RulerIcon({ size = 22, color = '#0A2621' }: RulerIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <G transform="rotate(45 11 11)">
        <Rect x={2} y={8} width={18} height={6} rx={2} stroke={color} strokeWidth={2} strokeLinejoin="round" />
        <Line x1={6} y1={8} x2={6} y2={11} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <Line x1={10} y1={8} x2={10} y2={13} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <Line x1={14} y1={8} x2={14} y2={11} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </G>
    </Svg>
  );
});
