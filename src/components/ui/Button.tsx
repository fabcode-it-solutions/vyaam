import { memo, useCallback, useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Motion, Radius, Spacing, useTheme, type Theme } from '@/theme';

import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

const HEIGHT: Record<ButtonSize, number> = { small: 36, medium: 44, large: 52 };
const H_PADDING: Record<ButtonSize, number> = {
  small: Spacing.s3,
  medium: Spacing.s4,
  large: Spacing.s5,
};
const LABEL_VARIANT: Record<ButtonSize, 'h5' | 'h4'> = {
  small: 'h5',
  medium: 'h4',
  large: 'h4',
};

function variantStyle(theme: Theme, variant: ButtonVariant, disabled: boolean) {
  const { colors } = theme;
  if (disabled) {
    return {
      container: { backgroundColor: colors.border, borderWidth: 0 },
      label: colors.textMuted,
    };
  }
  switch (variant) {
    case 'primary':
      return { container: { backgroundColor: colors.brand, borderWidth: 0 }, label: colors.onBrand };
    case 'secondary':
      return {
        container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.brand },
        label: colors.brand,
      };
    case 'accent':
      return { container: { backgroundColor: colors.accent, borderWidth: 0 }, label: colors.onAccent };
    case 'ghost':
      return { container: { backgroundColor: 'transparent', borderWidth: 0 }, label: colors.brand };
    case 'destructive':
      return {
        container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.danger },
        label: colors.danger,
      };
  }
}

/**
 * Primary/Secondary/Accent/Ghost/Destructive × Small/Medium/Large, matching
 * the Brand Guide's Buttons component set (section 05). Guidance the guide
 * calls out but this component can't enforce on its own: exactly one Primary
 * and at most one Accent per screen, Accent is never used for navigation or
 * submit, and Destructive actions should always be confirmed before firing
 * onPress.
 */
export const Button = memo(function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const pressed = useSharedValue(0);
  const isDisabled = disabled || loading;
  const { container, label: labelColor } = useMemo(
    () => variantStyle(theme, variant, disabled),
    [theme, variant, disabled],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.03 }],
  }));

  const handlePressIn = useCallback(() => {
    pressed.value = withTiming(1, { duration: Motion.fast });
  }, [pressed]);
  const handlePressOut = useCallback(() => {
    pressed.value = withTiming(0, { duration: Motion.fast });
  }, [pressed]);

  return (
    <Animated.View style={[fullWidth && styles.fullWidth, animatedStyle, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={size === 'small' ? { top: 4, bottom: 4, left: 4, right: 4 } : undefined}
        style={[
          styles.base,
          {
            height: HEIGHT[size],
            minWidth: HEIGHT[size],
            paddingHorizontal: H_PADDING[size],
            borderRadius: Radius.full,
          },
          container,
          fullWidth && styles.fullWidth,
        ]}>
        <Text
          variant={LABEL_VARIANT[size]}
          numberOfLines={1}
          style={[styles.label, { color: labelColor }, loading && styles.hiddenLabel]}>
          {label}
        </Text>
        {loading && (
          <View style={styles.spinner} pointerEvents="none">
            <ActivityIndicator color={labelColor} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  label: {
    textAlign: 'center',
  },
  hiddenLabel: {
    opacity: 0,
  },
  spinner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
