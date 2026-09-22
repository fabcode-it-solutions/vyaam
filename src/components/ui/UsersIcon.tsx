import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type UsersIconProps = {
  size?: number;
  color?: string;
};

/**
 * Two-person glyph — "Community" tab.
 * Best-effort trace, not yet confirmed against the Brand Guide icon set —
 * revisit once Figma Dev Mode access lets us pull the real bottom-tab icons.
 */
export const UsersIcon = memo(function UsersIcon({ size = 22, color = '#6E7B76' }: UsersIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M14.6667 19.25V17.4167C14.6667 16.4442 14.2804 15.5116 13.5927 14.8239C12.9051 14.1363 11.9725 13.75 11 13.75H5.50001C4.52755 13.75 3.59492 14.1363 2.90729 14.8239C2.21965 15.5116 1.83334 16.4442 1.83334 17.4167V19.25"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.6667 2.86743C15.4529 3.07127 16.1493 3.53042 16.6464 4.17282C17.1435 4.81522 17.4132 5.6045 17.4132 6.41677C17.4132 7.22903 17.1435 8.01831 16.6464 8.66071C16.1493 9.30311 15.4529 9.76226 14.6667 9.9661"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.1667 19.25V17.4166C20.1661 16.6042 19.8956 15.815 19.3979 15.1729C18.9002 14.5308 18.2033 14.0722 17.4167 13.8691"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.25001 10.0833C10.2751 10.0833 11.9167 8.44171 11.9167 6.41667C11.9167 4.39162 10.2751 2.75 8.25001 2.75C6.22497 2.75 4.58334 4.39162 4.58334 6.41667C4.58334 8.44171 6.22497 10.0833 8.25001 10.0833Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
