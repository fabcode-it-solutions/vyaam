import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type LocationPinIconProps = {
  size?: number;
  color?: string;
};

/** Map-pin glyph — Home location selector, "near me" affordances. */
export const LocationPinIcon = memo(function LocationPinIcon({
  size = 16,
  color = '#4A5A55',
}: LocationPinIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8.40067 14.5327C9.64067 13.462 13.3333 9.99537 13.3333 6.66671C13.3333 5.25222 12.7714 3.89567 11.7712 2.89547C10.771 1.89528 9.41449 1.33337 8 1.33337C6.58551 1.33337 5.22896 1.89528 4.22876 2.89547C3.22857 3.89567 2.66667 5.25222 2.66667 6.66671C2.66667 9.99537 6.35933 13.462 7.59933 14.5327C7.71485 14.6196 7.85547 14.6665 8 14.6665C8.14453 14.6665 8.28515 14.6196 8.40067 14.5327Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 8.66663C9.10457 8.66663 10 7.7712 10 6.66663C10 5.56206 9.10457 4.66663 8 4.66663C6.89543 4.66663 6 5.56206 6 6.66663C6 7.7712 6.89543 8.66663 8 8.66663Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
