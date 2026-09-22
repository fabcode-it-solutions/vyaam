import { memo } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type ImageIconProps = {
  size?: number;
  color?: string;
};

/** Photo-frame glyph — progress-photos rows. */
export const ImageIcon = memo(function ImageIcon({ size = 22, color = '#0A2621' }: ImageIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={4} width={18} height={16} rx={2} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Circle cx={8.5} cy={9.5} r={1.5} stroke={color} strokeWidth={2} />
      <Path
        d="M21 15.5 16 10.5l-9 9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
