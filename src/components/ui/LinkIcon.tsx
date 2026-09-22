import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type LinkIconProps = {
  size?: number;
  color?: string;
};

/** Chain-link glyph — connected-account rows (e.g. Google account, Account settings). */
export const LinkIcon = memo(function LinkIcon({ size = 22, color = '#0A2621' }: LinkIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.5 14.5 14.5 9.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M11 6.5 12.5 5A4 4 0 1 1 18 10.5l-1.5 1.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 17.5 11.5 19A4 4 0 1 1 6 13.5l1.5-1.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
