import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type UserIconProps = {
  size?: number;
  color?: string;
};

/**
 * Single-person glyph — "Me" tab.
 * Best-effort trace, not yet confirmed against the Brand Guide icon set —
 * revisit once Figma Dev Mode access lets us pull the real bottom-tab icons.
 */
export const UserIcon = memo(function UserIcon({ size = 22, color = '#4A5A55' }: UserIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M17.4167 19.25V17.4167C17.4167 16.4442 17.0304 15.5116 16.3427 14.8239C15.6551 14.1363 14.7225 13.75 13.75 13.75H8.25001C7.27755 13.75 6.34492 14.1363 5.65729 14.8239C4.96965 15.5116 4.58334 16.4442 4.58334 17.4167V19.25"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 10.0833C13.0251 10.0833 14.6667 8.44171 14.6667 6.41667C14.6667 4.39162 13.0251 2.75 11 2.75C8.97497 2.75 7.33334 4.39162 7.33334 6.41667C7.33334 8.44171 8.97497 10.0833 11 10.0833Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
