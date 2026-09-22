import { memo } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, useTheme } from '@/theme';

import { ArrowIcon } from './ArrowIcon';

export type BackButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Circular back-nav affordance reused across auth/intake screens (e.g.
 * Figma nodes 38:25, 58:52) — 44px, 6% black tint circle, 18px ink arrow.
 */
export const BackButton = memo(function BackButton({ onPress, style }: BackButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      onPress={onPress}
      style={[styles.button, style]}>
      <ArrowIcon direction="left" size={18} color={colors.textPrimary} />
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
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
});
