import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type XIconProps = {
  size?: number;
  color?: string;
};

/** Close glyph — removable selections (Figma node 113:378). */
export const XIcon = memo(function XIcon({ size = 14, color = '#6E7B76' }: XIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M10.5 3.5L3.5 10.5" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3.5 3.5L10.5 10.5" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
});
