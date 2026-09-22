import { memo, type ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';

import { Text } from './Text';

export type PillProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  /** 'chip' for filter/select chips, 'segment' for a segmented-control option. */
  variant?: 'chip' | 'segment';
  /** The dashed "+ Other" affordance that opens a free-text field. */
  dashed?: boolean;
  leading?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * One component for two jobs, per the Brand Guide (section 06 uses it as a
 * status/attribute chip; section 07.1 reuses the same shape, selected-fill
 * behaviour for segmented controls). Selected always fills brand-ink,
 * unselected is an outline — never a second near-duplicate component.
 */
export const Pill = memo(function Pill({
  label,
  selected = false,
  onPress,
  disabled = false,
  variant = 'chip',
  dashed = false,
  leading,
  style,
}: PillProps) {
  const { colors } = useTheme();

  const container: ViewStyle = selected
    ? { backgroundColor: colors.brand, borderWidth: 0 }
    : {
        backgroundColor: variant === 'segment' ? 'transparent' : colors.surface,
        borderWidth: dashed ? 1 : 1,
        borderColor: colors.border,
        borderStyle: dashed ? 'dashed' : 'solid',
      };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled || !onPress}
      onPress={onPress}
      hitSlop={onPress ? { top: 4, bottom: 4, left: 2, right: 2 } : undefined}
      style={[
        styles.base,
        { borderRadius: variant === 'segment' ? Radius.sm : Radius.full },
        container,
        disabled && styles.disabled,
        style,
      ]}>
      {leading}
      <Text
        variant="h5"
        numberOfLines={1}
        color={selected ? 'onBrand' : 'textPrimary'}
        style={leading ? styles.labelWithLeading : undefined}>
        {label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 41,
    paddingHorizontal: Spacing.s4,
  },
  labelWithLeading: {
    marginLeft: Spacing.s2,
  },
  disabled: {
    opacity: 0.5,
  },
});
