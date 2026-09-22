import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type ShieldCheckIconProps = {
  size?: number;
  color?: string;
};

/** Shield-with-checkmark glyph — identity/trust verification intros. */
export const ShieldCheckIcon = memo(function ShieldCheckIcon({ size = 22, color = '#0A2621' }: ShieldCheckIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 12.4l2.3 2.3 4.7-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
