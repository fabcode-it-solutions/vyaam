import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type BookIconProps = {
  size?: number;
  color?: string;
};

/** Open-book glyph — guidelines/reading rows (e.g. Community Guidelines). */
export const BookIcon = memo(function BookIcon({ size = 22, color = '#0A2621' }: BookIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 6.5c-1.4-1.3-3.4-2-6.5-2A1.5 1.5 0 0 0 4 6v12c3.1 0 5.1.7 6.5 2m1.5-13.5c1.4-1.3 3.4-2 6.5-2A1.5 1.5 0 0 1 20 6v12c-3.1 0-5.1.7-6.5 2M12 6.5v13.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
