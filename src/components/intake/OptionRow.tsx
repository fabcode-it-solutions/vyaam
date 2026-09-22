import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';
import { Text } from '@/components/ui';

export type OptionRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** Single-select radio row used by the Intake/* question screens (e.g. Goal, Diet Type). */
export const OptionRow = memo(function OptionRow({ label, selected, onPress }: OptionRowProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: colors.surface,
          borderColor: selected ? colors.brand : colors.border,
          borderWidth: selected ? 2 : 1,
        },
      ]}>
      <Text variant="h5">{label}</Text>
      <View style={[styles.radioOuter, { borderColor: selected ? colors.brand : colors.border }]}>
        {selected && <View style={[styles.radioInner, { backgroundColor: colors.brand }]} />}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  option: {
    height: 56,
    borderRadius: Radius.media,
    paddingHorizontal: Spacing.s4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: Radius.full,
  },
});
