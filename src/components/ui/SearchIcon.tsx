import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type SearchIconProps = {
  size?: number;
  color?: string;
};

/** Magnifying-glass glyph — role-select "Find a trainer" card, Discover search bar. */
export const SearchIcon = memo(function SearchIcon({ size = 22, color = '#0A2621' }: SearchIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M19.25 19.25L15.2717 15.2717"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.0833 17.4167C14.1334 17.4167 17.4167 14.1334 17.4167 10.0833C17.4167 6.03325 14.1334 2.75 10.0833 2.75C6.03325 2.75 2.75 6.03325 2.75 10.0833C2.75 14.1334 6.03325 17.4167 10.0833 17.4167Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
