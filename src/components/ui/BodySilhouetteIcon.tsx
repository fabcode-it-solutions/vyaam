import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type BodySilhouetteIconProps = {
  width?: number;
  height?: number;
  color?: string;
};

/** Front-view body outline — backdrop for the pain/injury body map (Figma node 113:356). */
export const BodySilhouetteIcon = memo(function BodySilhouetteIcon({
  width = 180,
  height = 360,
  color = '#E3DFD4',
}: BodySilhouetteIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 180 360" fill="none">
      <Path
        d="M90 54.9C102.923 54.9 113.4 44.4235 113.4 31.5C113.4 18.5765 102.923 8.1 90 8.1C77.0765 8.1 66.6 18.5765 66.6 31.5C66.6 44.4235 77.0765 54.9 90 54.9Z"
        fill={color}
      />
      <Path
        d="M54 67.5C78 59.7 102 59.7 126 67.5L135 94.5C136.2 118.5 134.7 139.5 130.5 157.5L124.2 207C123 225 121.2 243 118.8 261L115.2 324C114.6 331.2 111 334.8 104.4 334.8H97.2C93.6 334.8 91.5 331.8 90.9 325.8L88.2 252C87.6 246 86.4 246 84.6 252L79.2 325.8C78.6 331.8 76.5 334.8 72.9 334.8H65.7C59.1 334.8 56.1 331.2 56.7 324L54 261C51.6 243 50.1 225 49.5 207L45 157.5C42 139.5 41.4 118.5 43.2 94.5L54 67.5Z"
        fill={color}
      />
      <Path d="M55.8 81L27 135C24 141 24.6 146.4 28.8 151.2L36 158.4C40.8 162 45.3 160.8 49.5 154.8L70.2 108" fill={color} />
      <Path d="M124.2 81L153 135C156 141 155.4 146.4 151.2 151.2L144 158.4C139.2 162 134.7 160.8 130.5 154.8L109.8 108" fill={color} />
    </Svg>
  );
});
