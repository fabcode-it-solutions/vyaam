import { memo } from 'react';
import Svg, { Circle } from 'react-native-svg';

export type TargetIconProps = {
  size?: number;
  color?: string;
};

/** Bullseye glyph — ideal weight calculator card. */
export const TargetIcon = memo(function TargetIcon({ size = 22, color = '#0A2621' }: TargetIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx={11} cy={11} r={8} stroke={color} strokeWidth={2} />
      <Circle cx={11} cy={11} r={4.5} stroke={color} strokeWidth={2} />
      <Circle cx={11} cy={11} r={1.25} fill={color} />
    </Svg>
  );
});
