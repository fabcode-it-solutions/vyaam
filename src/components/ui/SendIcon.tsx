import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type SendIconProps = {
  size?: number;
  color?: string;
};

/** Paper-plane glyph — the send affordance on Chat Thread's message composer. */
export const SendIcon = memo(function SendIcon({ size = 18, color = '#FAF7F0' }: SendIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 3 11 13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 3 14.5 21c-.1.28-.47.32-.63.07l-3.02-4.6a.75.75 0 0 0-.32-.27L6 13.65c-.28-.13-.27-.53.02-.65L21 3Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
