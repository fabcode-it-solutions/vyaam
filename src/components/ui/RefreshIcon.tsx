import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type RefreshIconProps = {
  size?: number;
  color?: string;
};

/** Circular-arrow glyph — reschedule affordances (Manage Session). */
export const RefreshIcon = memo(function RefreshIcon({ size = 20, color = '#0A2621' }: RefreshIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 4v6h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M3.51 15a9 9 0 1 0 2.13-9.36L3 10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
