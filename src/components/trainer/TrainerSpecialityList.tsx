import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Pill } from '@/components/ui';
import { Spacing } from '@/theme';

export type TrainerSpecialityListProps = {
  specialities: string[];
};

/** Trainer Profile's "Specialities" tag wrap — informational, not filterable here. */
export const TrainerSpecialityList = memo(function TrainerSpecialityList({ specialities }: TrainerSpecialityListProps) {
  return (
    <View style={styles.wrap}>
      {specialities.map((speciality) => (
        <Pill key={speciality} label={speciality} selected={false} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
});
