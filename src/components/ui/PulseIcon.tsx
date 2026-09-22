import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type PulseIconProps = {
  size?: number;
  color?: string;
};

/** Heartbeat/activity-wave glyph — TDEE & calorie calculator card. */
export const PulseIcon = memo(function PulseIcon({ size = 22, color = '#0A2621' }: PulseIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M2 11H6L8.5 5L12.5 17L15 11H20"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
