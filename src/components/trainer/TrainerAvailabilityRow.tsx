import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export type TrainerAvailabilityRowProps = {
  /** Subset of WEEK_DAYS this trainer takes sessions on. */
  availableDays: string[];
};

/** Trainer Profile's "Availability" strip — read-only, not a day picker. */
export const TrainerAvailabilityRow = memo(function TrainerAvailabilityRow({ availableDays }: TrainerAvailabilityRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {WEEK_DAYS.map((day) => {
        const available = availableDays.includes(day);
        return (
          <View
            key={day}
            accessibilityRole="text"
            accessibilityLabel={`${day}${available ? ', available' : ', unavailable'}`}
            style={[
              styles.chip,
              {
                backgroundColor: available ? colors.brand : colors.surface,
                borderColor: colors.border,
                borderWidth: available ? 0 : 1,
                borderRadius: Radius.full,
              },
            ]}>
            <Text variant="caption" color={available ? 'onBrand' : 'textMuted'}>
              {day}
            </Text>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.s2,
  },
  chip: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
