import { memo } from 'react';
import Svg, { Line, Path } from 'react-native-svg';

export type DocumentIconProps = {
  size?: number;
  color?: string;
};

/** Page-with-lines glyph — document/log/legal-text rows. */
export const DocumentIcon = memo(function DocumentIcon({ size = 22, color = '#0A2621' }: DocumentIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3.5h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="M15 3.5v4h4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={8} y1={13} x2={16} y2={13} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={8} y1={17} x2={13} y2={17} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});
