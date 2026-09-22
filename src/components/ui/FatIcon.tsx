import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type FatIconProps = {
  size?: number;
  color?: string;
};

/** Droplet glyph — macro breakdown on the Diet Plan calorie card (Figma node 70:178). */
export const FatIcon = memo(function FatIcon({ size = 14, color = '#FAF7F0' }: FatIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M7 12.8333C8.08297 12.8333 9.12158 12.4031 9.88735 11.6374C10.6531 10.8716 11.0833 9.83297 11.0833 8.75C11.0833 7.58333 10.5 6.475 9.33333 5.54167C8.16667 4.60833 7.29167 3.20833 7 1.75C6.70833 3.20833 5.83333 4.60833 4.66667 5.54167C3.5 6.475 2.91667 7.58333 2.91667 8.75C2.91667 9.83297 3.34687 10.8716 4.11265 11.6374C4.87842 12.4031 5.91703 12.8333 7 12.8333Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
