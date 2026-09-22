import { memo } from 'react';
import Svg, { Line, Path } from 'react-native-svg';

export type ReceiptIconProps = {
  size?: number;
  color?: string;
};

/** Document/receipt glyph — subscription & billing row. */
export const ReceiptIcon = memo(function ReceiptIcon({ size = 22, color = '#0A2621' }: ReceiptIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M14 2v6h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={8} y1={13} x2={16} y2={13} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={8} y1={17} x2={16} y2={17} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});
