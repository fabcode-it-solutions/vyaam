import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type PieChartIconProps = {
  size?: number;
  color?: string;
};

/** Pie-chart glyph — macro split calculator card. */
export const PieChartIcon = memo(function PieChartIcon({ size = 22, color = '#0A2621' }: PieChartIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx={11} cy={11} r={8} stroke={color} strokeWidth={2} />
      <Path d="M11 3V11H19" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M11 11L16.5 16.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});
