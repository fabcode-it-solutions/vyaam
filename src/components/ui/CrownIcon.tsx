import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type CrownIconProps = {
  size?: number;
  color?: string;
};

/** Crown glyph — Premium upgrade prompt on the Subscription screen. */
export const CrownIcon = memo(function CrownIcon({ size = 20, color = '#E8762C' }: CrownIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 8l4 3 5-6 5 6 4-3-1.5 10h-15L3 8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
