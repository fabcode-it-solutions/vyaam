import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type ScanIconProps = {
  size?: number;
  color?: string;
};

/** Viewfinder-corners glyph — barcode/photo scan action beside a search field. */
export const ScanIcon = memo(function ScanIcon({ size = 20, color = '#FAF7F0' }: ScanIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M2.75 7.33333V4.58333A1.83 1.83 0 014.58 2.75H7.33" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14.6667 2.75H17.4167A1.83 1.83 0 0119.25 4.58333V7.33333" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19.25 14.6667V17.4167A1.83 1.83 0 0117.42 19.25H14.67" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7.33333 19.25H4.58333A1.83 1.83 0 012.75 17.4167V14.6667" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M2.75 11H19.25" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
});
