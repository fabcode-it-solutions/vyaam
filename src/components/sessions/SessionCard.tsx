import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CalendarIcon, Card, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type UpcomingSession = {
  id: string;
  trainerName: string;
  /** e.g. "6:00 AM" for a session tomorrow, or "Thu, 7 Aug · 7:00 PM" further out. */
  dateTimeLabel: string;
  /** e.g. "Session 3 of 4". */
  sessionLabel: string;
};

export type SessionCardProps = {
  session: UpcomingSession;
  onPress: (session: UpcomingSession) => void;
};

/** One row on Upcoming Sessions — trainer, date/time, and package progress. */
export const SessionCard = memo(function SessionCard({ session, onPress }: SessionCardProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(session), [onPress, session]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${session.trainerName} session`} onPress={handlePress}>
      <Card style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: colors.border }]} />
        <View style={styles.info}>
          <Text variant="h5" numberOfLines={1}>
            {session.trainerName}
          </Text>
          <View style={styles.timeRow}>
            <CalendarIcon size={13} color={colors.textMuted} />
            <Text variant="caption" color="textSecondary" numberOfLines={1}>
              {session.dateTimeLabel}
            </Text>
          </View>
        </View>
        <Text variant="caption" color="textMuted" numberOfLines={1} style={tabularNums}>
          {session.sessionLabel}
        </Text>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.media,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
