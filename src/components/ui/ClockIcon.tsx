import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type ClockIconProps = {
  size?: number;
  color?: string;
};

/** Duration glyph — workout focus card (Figma node 50:80). */
export const ClockIcon = memo(function ClockIcon({ size = 14, color = '#FAF7F0' }: ClockIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M7 12.8333C10.2217 12.8333 12.8333 10.2217 12.8333 7C12.8333 3.77834 10.2217 1.16667 7 1.16667C3.77834 1.16667 1.16667 3.77834 1.16667 7C1.16667 10.2217 3.77834 12.8333 7 12.8333Z"
        stroke={color}
        strokeOpacity={0.6}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 3.5V7L9.33333 8.16667"
        stroke={color}
        strokeOpacity={0.6}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
