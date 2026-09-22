import { memo, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Pill } from '@/components/ui';
import { Spacing } from '@/theme';

export type CategoryChip = {
  key: string;
  label: string;
};

export type CategoryChipsProps = {
  options: CategoryChip[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

/** Home feed's filter row (All / Near you / Top rated / Yoga / Gym …) — a bounded, curated set, not a paginated list. */
export const CategoryChips = memo(function CategoryChips({ options, selectedKey, onSelect }: CategoryChipsProps) {
  const handleSelect = useCallback((key: string) => onSelect(key), [onSelect]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {options.map((option) => (
        <Pill
          key={option.key}
          label={option.label}
          selected={option.key === selectedKey}
          onPress={() => handleSelect(option.key)}
        />
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  content: {
    gap: Spacing.s2,
  },
});
