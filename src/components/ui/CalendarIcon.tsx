import { memo } from 'react';
import Svg, { Line, Rect } from 'react-native-svg';

export type CalendarIconProps = {
  size?: number;
  color?: string;
  /** Renders an "×" in the calendar body instead of the date grid — an expired/closed date (e.g. Request Expired). */
  expired?: boolean;
};

/** Calendar glyph — session-reminder rows, or the expired-date state with `expired`. */
export const CalendarIcon = memo(function CalendarIcon({ size = 22, color = '#0A2621', expired = false }: CalendarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5} width={18} height={16} rx={2} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Line x1={3} y1={10} x2={21} y2={10} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={8} y1={2.5} x2={8} y2={6.5} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={16} y1={2.5} x2={16} y2={6.5} stroke={color} strokeWidth={2} strokeLinecap="round" />
      {expired && (
        <>
          <Line x1={9} y1={14} x2={15} y2={19} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Line x1={15} y1={14} x2={9} y2={19} stroke={color} strokeWidth={2} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
});
