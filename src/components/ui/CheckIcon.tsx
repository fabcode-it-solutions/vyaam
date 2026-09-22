import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type CheckIconProps = {
  size?: number;
  color?: string;
};

/** Checkmark glyph — selected-state badges (role-select cards, list selections). */
export const CheckIcon = memo(function CheckIcon({ size = 13, color = '#FAF7F0' }: CheckIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <Path
        d="M10.8333 3.25L4.875 9.20833L2.16667 6.5"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
