import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type ShieldIconProps = {
  size?: number;
  color?: string;
};

/** Shield glyph — privacy settings row. */
export const ShieldIcon = memo(function ShieldIcon({ size = 22, color = '#0A2621' }: ShieldIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
