import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type HelpIconProps = {
  size?: number;
  color?: string;
};

/** Question-mark-in-circle glyph — help & support row. */
export const HelpIcon = memo(function HelpIcon({ size = 22, color = '#0A2621' }: HelpIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
      <Path
        d="M9.09 9a3 3 0 115.83 1c0 2-3 3-3 3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={17} r={1} fill={color} />
    </Svg>
  );
});
