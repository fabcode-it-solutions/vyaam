import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type SwapIconProps = {
  size?: number;
  color?: string;
};

/** Two-way exchange arrows — "Switch to trainer mode" row. */
export const SwapIcon = memo(function SwapIcon({ size = 22, color = '#0A2621' }: SwapIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17 1l4 4-4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M3 11V9a4 4 0 014-4h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M7 23l-4-4 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M21 13v2a4 4 0 01-4 4H3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
