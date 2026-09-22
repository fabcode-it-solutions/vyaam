import { memo } from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

export type PercentIconProps = {
  size?: number;
  color?: string;
};

/** Percent-sign glyph — discount/offer notifications. */
export const PercentIcon = memo(function PercentIcon({ size = 22, color = '#8C4212' }: PercentIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1={19} y1={5} x2={5} y2={19} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={6.5} cy={6.5} r={2.5} stroke={color} strokeWidth={2} />
      <Circle cx={17.5} cy={17.5} r={2.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
});
