import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type PlusIconProps = {
  size?: number;
  color?: string;
};

/** Plus glyph — quantity stepper increment (Figma node 152:501). */
export const PlusIcon = memo(function PlusIcon({ size = 14, color = '#FAF7F0' }: PlusIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M2.91667 7H11.0833" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 2.91667V11.0833" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
});
