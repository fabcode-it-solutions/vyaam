import { memo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export type MailIconProps = {
  size?: number;
  color?: string;
};

/** Envelope glyph — email address row (Account settings). */
export const MailIcon = memo(function MailIcon({ size = 22, color = '#0A2621' }: MailIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2.5} y={5} width={19} height={14} rx={2} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path
        d="M3.5 6.5 12 13l8.5-6.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
