import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type DropletIconProps = {
  size?: number;
  color?: string;
};

/** Water-drop glyph — daily water target calculator card. */
export const DropletIcon = memo(function DropletIcon({ size = 22, color = '#0A2621' }: DropletIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 2C11 2 5 9.5 5 14A6 6 0 0011 20A6 6 0 0017 14C17 9.5 11 2 11 2Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
