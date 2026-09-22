import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type PhoneIconProps = {
  size?: number;
  color?: string;
};

/** Phone-handset glyph — phone number row (Account settings). */
export const PhoneIcon = memo(function PhoneIcon({ size = 22, color = '#0A2621' }: PhoneIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.5 3.5h3.2l1.6 4-2 1.5a12.5 12.5 0 0 0 5.7 5.7l1.5-2 4 1.6v3.2c0 1.1-.9 2-2 2C9.6 19.5 4.5 14.4 4.5 5.5c0-1.1.9-2 2-2Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
