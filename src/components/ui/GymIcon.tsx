import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type GymIconProps = {
  size?: number;
  color?: string;
};

/** Weight-rack glyph — "At a gym" training-location option (Figma node 109:372). */
export const GymIcon = memo(function GymIcon({ size = 22, color = '#0A2621' }: GymIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M9.16667 11H12.8333" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9.16667 7.33333H12.8333" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M12.8333 19.25V16.5C12.8333 16.0138 12.6402 15.5475 12.2964 15.2036C11.9525 14.8598 11.4862 14.6667 11 14.6667C10.5138 14.6667 10.0475 14.8598 9.70364 15.2036C9.35982 15.5475 9.16667 16.0138 9.16667 16.5V19.25"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.5 9.16667H3.66667C3.18044 9.16667 2.71412 9.35982 2.3703 9.70364C2.02649 10.0475 1.83333 10.5138 1.83333 11V17.4167C1.83333 17.9029 2.02649 18.3692 2.3703 18.713C2.71412 19.0568 3.18044 19.25 3.66667 19.25H18.3333C18.8196 19.25 19.2859 19.0568 19.6297 18.713C19.9735 18.3692 20.1667 17.9029 20.1667 17.4167V8.25C20.1667 7.76377 19.9735 7.29745 19.6297 6.95364C19.2859 6.60982 18.8196 6.41667 18.3333 6.41667H16.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.5 19.25V4.58333C5.5 4.0971 5.69315 3.63079 6.03697 3.28697C6.38079 2.94315 6.8471 2.75 7.33333 2.75H14.6667C15.1529 2.75 15.6192 2.94315 15.963 3.28697C16.3068 3.63079 16.5 4.0971 16.5 4.58333V19.25"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
