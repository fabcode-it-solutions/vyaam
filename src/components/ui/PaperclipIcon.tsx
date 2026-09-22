import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type PaperclipIconProps = {
  size?: number;
  color?: string;
};

/** Paperclip glyph — attach-a-screenshot affordance on Report an issue. */
export const PaperclipIcon = memo(function PaperclipIcon({ size = 18, color = '#0A2621' }: PaperclipIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 11.5 12.5 20a4.5 4.5 0 0 1-6.36-6.36L14.6 5.14a3 3 0 0 1 4.24 4.24l-8.48 8.48a1.5 1.5 0 0 1-2.12-2.12l7.42-7.42"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
