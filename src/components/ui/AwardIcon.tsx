import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type AwardIconProps = {
  size?: number;
  color?: string;
};

/** Medal/ribbon glyph — streaks & achievements entry point on the Log hub. */
export const AwardIcon = memo(function AwardIcon({ size = 20, color = '#8C4212' }: AwardIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx={11} cy={8} r={5.5} stroke={color} strokeWidth={2} />
      <Path
        d="M8 12.5L6.5 19.5L11 17L15.5 19.5L14 12.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
