import { memo } from 'react';
import Svg, { Line, Path } from 'react-native-svg';

export type LogOutIconProps = {
  size?: number;
  color?: string;
};

/** Door-with-arrow glyph — log out row. */
export const LogOutIcon = memo(function LogOutIcon({ size = 22, color = '#B3261E' }: LogOutIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M16 17l5-5-5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={21} y1={12} x2={9} y2={12} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});
