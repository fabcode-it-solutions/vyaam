import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type CameraIconProps = {
  size?: number;
  color?: string;
};

/** Camera glyph — avatar edit badge on Edit profile. */
export const CameraIcon = memo(function CameraIcon({ size = 12, color = '#FAF7F0' }: CameraIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 8h3l2-3h6l2 3h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={13.5} r={3.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
});
