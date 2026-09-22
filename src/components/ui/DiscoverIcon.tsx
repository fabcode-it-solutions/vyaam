import { memo } from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

export type DiscoverIconProps = {
  size?: number;
  color?: string;
};

/** Four-point sparkle + small dot glyph — AI-generation moments (e.g. Intake/Generating). */
export const DiscoverIcon = memo(function DiscoverIcon({ size = 44, color = '#6E7B76' }: DiscoverIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Defs>
        <ClipPath id="clip0_54_123">
          <Rect width="22" height="22" fill="white" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip0_54_123)">
        <Circle cx="11" cy="11" r="9.16667" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path
          d="M14.8867 7.11328L13.233 12.0734C13.143 12.3434 12.9914 12.5888 12.7901 12.79C12.5888 12.9913 12.3435 13.1429 12.0734 13.2329L7.11333 14.8866L8.767 9.92653C8.857 9.6565 9.00864 9.41113 9.20991 9.20986C9.41118 9.00859 9.65655 8.85695 9.92658 8.76695L14.8867 7.11328Z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
});
