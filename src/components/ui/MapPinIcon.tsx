import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type MapPinIconProps = {
  size?: number;
  color?: string;
  /** The small centre dot — defaults to punching through to the map background. */
  dotColor?: string;
};

/** Solid map-marker glyph — Discover map view, "exact location" pins (e.g. gym trainers). */
export const MapPinIcon = memo(function MapPinIcon({ size = 28, color = '#0F3D34', dotColor = '#FAF7F0' }: MapPinIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22S5 13.75 5 8.5A7 7 0 1 1 19 8.5C19 13.75 12 22 12 22Z"
        fill={color}
      />
      <Circle cx={12} cy={8.5} r={2.5} fill={dotColor} />
    </Svg>
  );
});
