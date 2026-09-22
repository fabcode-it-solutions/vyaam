import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type TrendUpIconProps = {
  size?: number;
  color?: string;
  /** 'down' flips the glyph vertically — e.g. a weight-log entry that decreased. */
  direction?: 'up' | 'down';
};

/** Upward-trend glyph — progress-charts entry point on the Log hub. */
export const TrendUpIcon = memo(function TrendUpIcon({
  size = 20,
  color = '#8C4212',
  direction = 'up',
}: TrendUpIconProps) {
  const style = direction === 'down' ? { transform: [{ scaleY: -1 }] } : undefined;
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={style}>
      <Path
        d="M3 15L8.5 9.5L12.5 13.5L19 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 7H19V12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
