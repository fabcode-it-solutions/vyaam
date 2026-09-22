import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text, XIcon } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type FilterChipProps = {
  label: string;
  onRemove: () => void;
};

/**
 * An active-filter chip ("At home", "4.5+") shown once a filter has been
 * applied from the Filters sheet — brand-filled like a selected `Pill`, but
 * with a trailing remove affordance the base `Pill` doesn't support.
 */
export const FilterChip = memo(function FilterChip({ label, onRemove }: FilterChipProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.base, { backgroundColor: colors.brand, borderRadius: Radius.full }]}>
      <Text variant="h5" color="onBrand" numberOfLines={1}>
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${label} filter`}
        hitSlop={8}
        onPress={onRemove}
        style={styles.remove}>
        <XIcon size={12} color={colors.onBrand} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
    minHeight: 41,
    paddingLeft: Spacing.s4,
    paddingRight: Spacing.s3,
  },
  remove: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
