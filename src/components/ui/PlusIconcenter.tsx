import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type PlusIconcenterProps = {
  size?: number;
  color?: string;
};

export const PlusIconcenter = memo(function PlusIconcenter({ size = 44, color = '#FAF7F0' }: PlusIconcenterProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 12H16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 8V16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
});
