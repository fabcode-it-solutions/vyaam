import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type SlidersIconProps = {
  size?: number;
  color?: string;
};

/** Filter/adjustments glyph — Diet Plan header action (Figma node 70:127). */
export const SlidersIcon = memo(function SlidersIcon({ size = 18, color = '#0A2621' }: SlidersIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path d="M7.5 3.75H2.25" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 14.25H2.25" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10.5 2.25V5.25" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 12.75V15.75" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15.75 9H9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15.75 14.25H12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15.75 3.75H10.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 7.5V10.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 9H2.25" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
});
