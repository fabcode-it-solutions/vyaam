import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type ChevronIconProps = {
  size?: number;
  color?: string;
  direction?: 'left' | 'right' | 'down';
};

/** Plain chevron (no tail line) — row disclosure affordance, e.g. meal rows on Diet Plan (Figma node 70:189). */
export const ChevronIcon = memo(function ChevronIcon({
  size = 16,
  color = '#6E7B76',
  direction = 'right',
}: ChevronIconProps) {
  const style =
    direction === 'left'
      ? { transform: [{ scaleX: -1 }] }
      : direction === 'down'
        ? { transform: [{ rotate: '90deg' }] }
        : undefined;
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <Path d="M6 12L10 8L6 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
});
