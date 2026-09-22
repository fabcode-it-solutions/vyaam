import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type WeekDay = {
  /** Short weekday label, e.g. "Mon". */
  label: string;
  /** Day-of-month number shown under the label. */
  date: number;
  /** Shows a small dot under the date — e.g. Trainer/Schedule's "has sessions" marker. */
  hasEvent?: boolean;
};

export type WeekDaySelectorProps = {
  days: WeekDay[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

/**
 * Seven-day strip above the calorie card on Diet Plan (Figma node 70:137).
 * Selected day fills brand-ink; unselected days are white/hairline-border
 * tiles — same fill-vs-outline convention as `Pill`, but this is a distinct
 * two-line date tile shape, not a chip, so it's its own component.
 */
export const WeekDaySelector = memo(function WeekDaySelector({
  days,
  selectedIndex,
  onSelect,
}: WeekDaySelectorProps) {
  return (
    <View style={styles.row}>
      {days.map((day, index) => (
        <DayCell
          key={`${day.label}-${day.date}`}
          day={day}
          selected={index === selectedIndex}
          onPress={() => onSelect(index)}
        />
      ))}
    </View>
  );
});

const DayCell = memo(function DayCell({
  day,
  selected,
  onPress,
}: {
  day: WeekDay;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(), [onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${day.label} ${day.date}`}
      accessibilityState={{ selected }}
      onPress={handlePress}
      style={[
        styles.cell,
        {
          backgroundColor: selected ? colors.brand : colors.surface,
          borderColor: colors.border,
          borderWidth: selected ? 0 : 1,
          borderRadius: Radius.media,
        },
      ]}>
      <Text variant="caption" color={selected ? 'onBrand' : 'textMuted'}>
        {day.label}
      </Text>
      <Text
        variant="h5"
        color={selected ? 'onBrand' : 'textPrimary'}
        style={tabularNums}>
        {day.date}
      </Text>
      {day.hasEvent && (
        <View style={[styles.dot, { backgroundColor: selected ? colors.onBrand : colors.accent }]} />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.s2,
  },
  cell: {
    flex: 1,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
