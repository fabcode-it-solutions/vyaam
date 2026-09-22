import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type ScaleIconProps = {
  size?: number;
  color?: string;
};

/** Bathroom-scale glyph — weight-log entry on the Log hub. */
export const ScaleIcon = memo(function ScaleIcon({ size = 22, color = '#0A2621' }: ScaleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M4 4h14a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={11} cy={12} r={3.4} stroke={color} strokeWidth={2} />
      <Path d="M11 12L13 9.6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
});
