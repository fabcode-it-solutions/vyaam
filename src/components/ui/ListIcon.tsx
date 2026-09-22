import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type ListIconProps = {
  size?: number;
  color?: string;
};

/** List-view glyph — Discover map header action (switch back to the results list). */
export const ListIcon = memo(function ListIcon({ size = 20, color = '#0A2621' }: ListIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx={4} cy={6} r={1.4} fill={color} />
      <Path d="M8.5 6H19.25" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={4} cy={11} r={1.4} fill={color} />
      <Path d="M8.5 11H19.25" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={4} cy={16} r={1.4} fill={color} />
      <Path d="M8.5 16H19.25" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});
