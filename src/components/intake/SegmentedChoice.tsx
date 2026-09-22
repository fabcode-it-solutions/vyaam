import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, useTheme } from '@/theme';

export type SegmentedChoiceOption<T extends string> = {
  value: T;
  label: string;
};

export type SegmentedChoiceProps<T extends string> = {
  options: SegmentedChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * Three-way pill segmented control used inside the pain-detail card for
 * "When does it hurt?" and "Diagnosed?" (Figma nodes 113:382 / 113:393) —
 * selected fills ink, unselected is a sand/hairline outline.
 */
export function SegmentedChoice<T extends string>({ options, value, onChange }: SegmentedChoiceProps<T>) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              {
                backgroundColor: selected ? colors.brand : colors.background,
                borderColor: colors.border,
                borderWidth: selected ? 0 : 1,
                borderRadius: Radius.sm,
              },
            ]}>
            <Text variant="caption" color={selected ? 'onBrand' : 'textSecondary'} numberOfLines={2} style={styles.label}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  option: {
    flex: 1,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  label: {
    textAlign: 'center',
  },
});
