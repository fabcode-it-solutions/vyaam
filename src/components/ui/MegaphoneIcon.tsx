import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type MegaphoneIconProps = {
  size?: number;
  color?: string;
};

/** Megaphone glyph — offers & promotions rows. */
export const MegaphoneIcon = memo(function MegaphoneIcon({ size = 22, color = '#0A2621' }: MegaphoneIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5v3a1.5 1.5 0 0 0 1.5 1.5H6l1.4 4.7a1 1 0 0 0 1 .8H10a1 1 0 0 0 1-1.2L9.8 15H10l10-4V9L10 5H4.5A1.5 1.5 0 0 0 3 6.5v4Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M20 9v6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});
