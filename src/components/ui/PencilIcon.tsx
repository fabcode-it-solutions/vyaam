import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type PencilIconProps = {
  size?: number;
  color?: string;
};

/** Small edit-pencil glyph — avatar edit badge on My Profile. */
export const PencilIcon = memo(function PencilIcon({ size = 12, color = '#FAF7F0' }: PencilIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.5 2.5a2.121 2.121 0 013 3L8 18l-4 1 1-4z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
