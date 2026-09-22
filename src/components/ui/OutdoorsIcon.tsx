import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type OutdoorsIconProps = {
  size?: number;
  color?: string;
};

/** Footprints/trail glyph — "Outdoors" training-location option (Figma node 109:382). */
export const OutdoorsIcon = memo(function OutdoorsIcon({ size = 22, color = '#0A2621' }: OutdoorsIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M9.16667 9.16667V9.35C9.76784 9.58119 10.2688 10.0161 10.5822 10.5788C10.8955 11.1415 11.0015 11.7964 10.8814 12.4292C10.7614 13.062 10.4231 13.6326 9.92544 14.0415C9.4278 14.4504 8.80241 14.6716 8.15833 14.6667H4.58333C3.94695 14.6508 3.33578 14.4147 2.85405 13.9986C2.37232 13.5824 2.04988 13.0121 1.94172 12.3848C1.83356 11.7574 1.94638 11.112 2.26095 10.5586C2.57551 10.0052 3.07233 9.57802 3.66667 9.35V9.16667C3.66667 8.43732 3.9564 7.73785 4.47212 7.22212C4.98785 6.7064 5.68732 6.41667 6.41667 6.41667C7.14601 6.41667 7.84549 6.7064 8.36121 7.22212C8.87694 7.73785 9.16667 8.43732 9.16667 9.16667Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M6.41667 14.6667V20.1667" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M11.9167 17.4167V20.1667" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M11 17.4167H18.6083C18.7877 17.4141 18.9625 17.359 19.1109 17.2581C19.2592 17.1572 19.3748 17.015 19.4431 16.8491C19.5114 16.6832 19.5295 16.5009 19.4952 16.3248C19.4609 16.1486 19.3756 15.9865 19.25 15.8583L16.5 12.8333H16.775C16.9544 12.8308 17.1291 12.7757 17.2775 12.6748C17.4259 12.5739 17.5414 12.4317 17.6097 12.2658C17.6781 12.0999 17.6962 11.9175 17.6619 11.7414C17.6275 11.5653 17.5423 11.4031 17.4167 11.275L14.6667 8.25H14.85C15.0372 8.26689 15.2251 8.22581 15.3882 8.13232C15.5513 8.03883 15.6817 7.89745 15.7618 7.72735C15.8418 7.55726 15.8676 7.36666 15.8357 7.1814C15.8038 6.99614 15.7157 6.82517 15.5833 6.69167L11.9167 2.75L10.6333 4.125"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
