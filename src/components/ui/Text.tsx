import { memo } from 'react';
import { Text as RNText, type TextProps } from 'react-native';

import { useTheme } from '@/theme';
import type { TypographyVariant } from '@/theme/typography';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: keyof ReturnType<typeof useTheme>['colors'];
};

/**
 * The one place Typography + colour tokens are wired into a <Text>. Screens
 * and other components should render copy through this rather than raw
 * <Text style={{ fontSize: ... }}> — that's how a hardcoded font size or hex
 * sneaks back in.
 */
export const Text = memo(function Text({
  variant = 'body',
  color = 'textPrimary',
  style,
  ...rest
}: AppTextProps) {
  const theme = useTheme();
  return (
    <RNText style={[theme.typography[variant], { color: theme.colors[color] }, style]} {...rest} />
  );
});
