import { memo } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type LockIconProps = {
  size?: number;
  color?: string;
  /** true renders the shackle swung open — "this unlocks X" moments (e.g. Accept Bid Confirmation). */
  open?: boolean;
};

/** Padlock glyph — change-password row (Account settings), or the open state for "this unlocks..." copy. */
export const LockIcon = memo(function LockIcon({ size = 22, color = '#0A2621', open = false }: LockIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={11} width={16} height={10} rx={2} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path
        d={open ? 'M7.5 11V7.5a4.5 4.5 0 0 1 8.7 -2.3' : 'M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11'}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={16} r={1.4} fill={color} />
    </Svg>
  );
});
