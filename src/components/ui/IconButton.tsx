import { memo, type ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, useTheme } from '@/theme';

export type IconButtonProps = {
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  /**
   * 'tint' = 6% black tint circle (e.g. back nav); 'surface' = white circle
   * with hairline border (e.g. header actions); 'solid' = brand-ink fill
   * (e.g. "new request" / add affordances — the one primary action per screen).
   */
  variant?: 'tint' | 'surface' | 'solid';
  style?: StyleProp<ViewStyle>;
};

/**
 * 44px circular icon-only action button — the shape reused for header
 * affordances throughout the build (back nav, filters, overflow actions).
 * `BackButton` is the specialised back-nav case; reach for this for any
 * other circular header icon action instead of hand-rolling a `Pressable`.
 */
export const IconButton = memo(function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'tint',
  style,
}: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      style={[
        styles.button,
        variant === 'tint'
          ? styles.tint
          : variant === 'solid'
            ? { backgroundColor: colors.brand }
            : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
        style,
      ]}>
      {icon}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tint: {
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
});
