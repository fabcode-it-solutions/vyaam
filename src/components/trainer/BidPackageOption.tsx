import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type BidPackage = {
  key: string;
  title: string;
  subtitle: string;
};

export type BidPackageOptionProps = {
  option: BidPackage;
  selected: boolean;
  onSelect: (key: string) => void;
};

/** One selectable session-package card on Trainer/Place a bid — radio-style, not a checkmark badge. */
export const BidPackageOption = memo(function BidPackageOption({ option, selected, onSelect }: BidPackageOptionProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onSelect(option.key), [onSelect, option.key]);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={option.title}
      accessibilityState={{ checked: selected }}
      onPress={handlePress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: selected ? colors.brand : colors.border,
          borderWidth: selected ? 2 : 1,
        },
      ]}>
      <View style={styles.text}>
        <Text variant="h5">{option.title}</Text>
        <Text variant="caption" color="textSecondary">
          {option.subtitle}
        </Text>
      </View>
      <View style={[styles.radio, { borderColor: selected ? colors.brand : colors.border }]}>
        {selected && <View style={[styles.radioDot, { backgroundColor: colors.brand }]} />}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.card,
    padding: Spacing.s4,
    gap: Spacing.s3,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
  },
});
