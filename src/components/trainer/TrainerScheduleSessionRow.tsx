import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { Spacing, tabularNums } from '@/theme';

export type TrainerScheduledSession = {
  id: string;
  /** e.g. "6:00 AM". */
  time: string;
  clientName: string;
  /** e.g. "45 min · At home". */
  subtitle: string;
};

export type TrainerScheduleSessionRowProps = {
  session: TrainerScheduledSession;
};

/** One booked session on Trainer/Schedule's day list — time column, then client + mode/duration. */
export const TrainerScheduleSessionRow = memo(function TrainerScheduleSessionRow({
  session,
}: TrainerScheduleSessionRowProps) {
  return (
    <Card style={styles.card}>
      <Text variant="h5" style={[styles.time, tabularNums]} numberOfLines={1}>
        {session.time}
      </Text>
      <View style={styles.body}>
        <Text variant="h5" numberOfLines={1}>
          {session.clientName}
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          {session.subtitle}
        </Text>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s4,
  },
  time: {
    width: 68,
  },
  body: {
    flex: 1,
    gap: 2,
  },
});
