import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { Spacing, tabularNums } from '@/theme';

export type TrainerStatCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
};

/** One tile in Trainer Home's earnings/rating stat row. */
export const TrainerStatCard = memo(function TrainerStatCard({ icon, value, label }: TrainerStatCardProps) {
  return (
    <Card style={styles.card}>
      {icon}
      <Text variant="h3" style={tabularNums}>
        {value}
      </Text>
      <Text variant="caption" color="textSecondary">
        {label}
      </Text>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: Spacing.s1,
  },
});
