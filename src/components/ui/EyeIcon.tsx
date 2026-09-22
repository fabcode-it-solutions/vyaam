import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type EyeIconProps = {
  size?: number;
  color?: string;
};

/** Open-eye glyph — visibility rows (e.g. profile visibility). */
export const EyeIcon = memo(function EyeIcon({ size = 22, color = '#0A2621' }: EyeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
    </Svg>
  );
});
