import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type BedIconProps = {
  size?: number;
  color?: string;
};

/** Bed-frame glyph — sleep-log entry on the Log hub. */
export const BedIcon = memo(function BedIcon({ size = 22, color = '#0A2621' }: BedIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M2 17V6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 14h18v3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 14v-2.5a2 2 0 00-2-2H4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 9.5V6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 9.5h5a1.5 1.5 0 000-3H5.5A1.5 1.5 0 004 8v1.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
