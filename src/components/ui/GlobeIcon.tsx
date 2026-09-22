import { memo } from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';

export type GlobeIconProps = {
  size?: number;
  color?: string;
};

/** Globe glyph — language settings row. */
export const GlobeIcon = memo(function GlobeIcon({ size = 22, color = '#0A2621' }: GlobeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
      <Line x1={2} y1={12} x2={22} y2={12} stroke={color} strokeWidth={2} />
      <Path
        d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
