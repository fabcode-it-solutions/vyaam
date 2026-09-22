import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type CarbsIconProps = {
  size?: number;
  color?: string;
};

/** Wheat-grain glyph — macro breakdown on the Diet Plan calorie card (Figma node 70:168). */
export const CarbsIcon = memo(function CarbsIcon({ size = 14, color = '#FAF7F0' }: CarbsIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M1.16667 12.8333L9.33333 4.66667" stroke={color} strokeOpacity={0.7} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M2.02417 7.30917L2.91667 6.41667L3.80917 7.30917C4.19032 7.69182 4.40432 8.20991 4.40432 8.75C4.40432 9.29009 4.19032 9.80818 3.80917 10.1908L2.91667 11.0833L2.02417 10.1908C1.64302 9.80818 1.42901 9.29009 1.42901 8.75C1.42901 8.20991 1.64302 7.69182 2.02417 7.30917Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.3575 4.97583L5.25 4.08333L6.1425 4.97583C6.52365 5.35849 6.73765 5.87657 6.73765 6.41667C6.73765 6.95676 6.52365 7.47485 6.1425 7.8575L5.25 8.75L4.3575 7.8575C3.97635 7.47485 3.76235 6.95676 3.76235 6.41667C3.76235 5.87657 3.97635 5.35849 4.3575 4.97583Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.69083 2.6425L7.58333 1.75L8.47583 2.6425C8.85698 3.02515 9.07099 3.54324 9.07099 4.08333C9.07099 4.62343 8.85698 5.14151 8.47583 5.52417L7.58333 6.41667L6.69083 5.52417C6.30968 5.14151 6.09568 4.62343 6.09568 4.08333C6.09568 3.54324 6.30968 3.02515 6.69083 2.6425Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.6667 1.16667H12.8333V2.33333C12.8333 2.95217 12.5875 3.54566 12.1499 3.98325C11.7123 4.42083 11.1188 4.66667 10.5 4.66667H9.33333V3.5C9.33333 2.88116 9.57917 2.28767 10.0168 1.85008C10.4543 1.4125 11.0478 1.16667 11.6667 1.16667Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.69083 10.1908L7.58333 11.0833L6.69083 11.9758C6.30818 12.357 5.79009 12.571 5.25 12.571C4.70991 12.571 4.19182 12.357 3.80917 11.9758L2.91667 11.0833L3.80917 10.1908C4.19182 9.80968 4.70991 9.59568 5.25 9.59568C5.79009 9.59568 6.30818 9.80968 6.69083 10.1908Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.02417 7.8575L9.91667 8.75L9.02417 9.6425C8.64151 10.0237 8.12343 10.2377 7.58333 10.2377C7.04324 10.2377 6.52515 10.0237 6.1425 9.6425L5.25 8.75L6.1425 7.8575C6.52515 7.47635 7.04324 7.26235 7.58333 7.26235C8.12343 7.26235 8.64151 7.47635 9.02417 7.8575Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.3575 5.52417L12.25 6.41667L11.3575 7.30917C10.9748 7.69032 10.4568 7.90432 9.91667 7.90432C9.37657 7.90432 8.85849 7.69032 8.47583 7.30917L7.58333 6.41667L8.47583 5.52417C8.85849 5.14302 9.37657 4.92901 9.91667 4.92901C10.4568 4.92901 10.9748 5.14302 11.3575 5.52417Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
