import { memo, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CheckIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type IconOptionCardProps = {
  icon: ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

/**
 * Single-select option card with a leading tinted icon + description —
 * distinct from the plain `OptionRow` radio (Figma "Intake/Training
 * Location", node 109:360). Selected state fills the icon circle with the
 * accent tint and swaps the trailing radio for a solid check badge.
 */
export const IconOptionCard = memo(function IconOptionCard({
  icon,
  label,
  description,
  selected,
  onPress,
}: IconOptionCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${label}, ${description}`}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: selected ? colors.brand : colors.border,
          borderWidth: selected ? 2 : 1,
          borderRadius: Radius.card,
        },
      ]}>
      <View style={[styles.iconCircle, { backgroundColor: selected ? colors.accentTint : colors.border }]}>
        {icon}
      </View>

      <View style={styles.body}>
        <Text variant="h5" numberOfLines={1}>
          {label}
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={2}>
          {description}
        </Text>
      </View>

      {selected ? (
        <View style={[styles.checkBadge, { backgroundColor: colors.brand }]}>
          <CheckIcon size={13} color={colors.onBrand} />
        </View>
      ) : (
        <View style={styles.checkBadgeSpacer} />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s3,
    gap: Spacing.s3,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeSpacer: {
    width: 24,
    height: 24,
  },
});
