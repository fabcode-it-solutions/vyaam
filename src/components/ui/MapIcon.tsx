import { memo } from 'react';
import Svg, { Line, Polygon } from 'react-native-svg';

export type MapIconProps = {
  size?: number;
  color?: string;
};

/** Folded-map glyph — Discover header action (view results on a map). */
export const MapIcon = memo(function MapIcon({ size = 20, color = '#0A2621' }: MapIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1={8} y1={2} x2={8} y2={18} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={16} y1={6} x2={16} y2={22} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
});
