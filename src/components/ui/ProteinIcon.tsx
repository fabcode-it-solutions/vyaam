import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type ProteinIconProps = {
  size?: number;
  color?: string;
};

/** Drumstick glyph — macro breakdown on the Diet Plan calorie card (Figma node 70:163). */
export const ProteinIcon = memo(function ProteinIcon({ size = 14, color = '#FAF7F0' }: ProteinIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M9.56667 7.99167C10.0451 7.63211 10.4316 7.1644 10.6946 6.62681C10.9577 6.08921 11.0897 5.49699 11.0799 4.89858C11.0701 4.30017 10.9188 3.71258 10.6384 3.18387C10.3579 2.65515 9.95632 2.20033 9.46639 1.8566C8.97646 1.51287 8.41211 1.29 7.81952 1.20622C7.22693 1.12243 6.62292 1.18012 6.0569 1.37455C5.49088 1.56899 4.97892 1.89464 4.5629 2.32489C4.14689 2.75514 3.83862 3.27776 3.66333 3.85C3.02167 5.67583 3.20833 6.125 1.80833 7.39667C1.52936 7.62538 1.32788 7.93471 1.23148 8.28233C1.13508 8.62995 1.14845 8.99887 1.26978 9.33859C1.39111 9.67831 1.61447 9.97224 1.90927 10.1801C2.20408 10.388 2.55593 10.4998 2.91667 10.5C5.25 10.5 7.81667 9.45 9.56667 7.99167Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.7917 3.5L12.0692 6.125C12.3137 6.87684 12.3163 7.68642 12.0767 8.43983C11.8371 9.19324 11.3673 9.85256 10.7333 10.325C8.98333 11.7833 6.41667 12.8333 4.08333 12.8333C3.75856 12.8329 3.44032 12.7421 3.16422 12.5711C2.88813 12.4 2.66506 12.1556 2.52 11.865L1.4 9.625"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.29167 6.41667C8.09708 6.41667 8.75 5.76375 8.75 4.95833C8.75 4.15292 8.09708 3.5 7.29167 3.5C6.48625 3.5 5.83333 4.15292 5.83333 4.95833C5.83333 5.76375 6.48625 6.41667 7.29167 6.41667Z"
        stroke={color}
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
