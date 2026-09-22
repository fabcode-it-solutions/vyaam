import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type ForkKnifeIconProps = {
  size?: number;
  color?: string;
};

/**
 * Fork + knife glyph — Brand Guide icon used on the diet-intake intro
 * (Figma node 58:57). Traced at its native 44x44 viewBox.
 */
export const ForkKnifeIcon = memo(function ForkKnifeIcon({ size = 44, color = '#8C4212' }: ForkKnifeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Path
        d="M5.5 3.66667V16.5C5.5 18.5167 7.15 20.1667 9.16667 20.1667H16.5C17.4725 20.1667 18.4051 19.7804 19.0927 19.0927C19.7804 18.4051 20.1667 17.4725 20.1667 16.5V3.66667"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12.8333 3.66667V40.3333" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M38.5 27.5V3.66667C36.0688 3.66667 33.7373 4.63244 32.0182 6.35152C30.2991 8.0706 29.3333 10.4022 29.3333 12.8333V23.8333C29.3333 25.85 30.9833 27.5 33 27.5H38.5ZM38.5 27.5V40.3333"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
