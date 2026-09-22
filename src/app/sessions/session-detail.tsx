import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Card, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

/**
 * Sessions/Session Detail — full view of one booked session, opened from
 * Upcoming Sessions. Fields below are illustrative (matches Upcoming
 * Sessions' mock sessions), keyed off the `id` route param; needs the real
 * session endpoint rather than a static lookup.
 */

type SessionDetailData = {
  dateLabel: string;
  timeRange: string;
  trainerName: string;
  location: string;
  packageProgress: string;
  price: number;
};

const SESSION_DETAILS: Record<string, SessionDetailData> = {
  'session-1': {
    dateLabel: 'Tomorrow',
    timeRange: '6:00 AM – 6:45 AM',
    trainerName: 'Anjali Kaushik',
    location: 'At your home',
    packageProgress: 'Session 3 of 4',
    price: 600,
  },
  'session-2': {
    dateLabel: 'Thu, 7 Aug',
    timeRange: '7:00 PM – 8:00 PM',
    trainerName: 'Rohit Sharma',
    location: 'At your home',
    packageProgress: 'Session 5 of 8',
    price: 750,
  },
  'session-3': {
    dateLabel: 'Sat, 9 Aug',
    timeRange: '6:00 AM – 6:45 AM',
    trainerName: 'Anjali Kaushik',
    location: 'At your home',
    packageProgress: 'Session 4 of 4',
    price: 600,
  },
};

export default function SessionDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const session = (id && SESSION_DETAILS[id]) || SESSION_DETAILS['session-1'];
  const firstName = session.trainerName.split(' ')[0];

  const rows = [
    { label: 'Trainer', value: session.trainerName },
    { label: 'Location', value: session.location },
    { label: 'Package', value: session.packageProgress },
    { label: 'Price', value: `₹${session.price}` },
  ];

  const handleMessage = useCallback(
    () => router.push({ pathname: '/chat/conversations-list', params: { name: session.trainerName } }),
    [session.trainerName],
  );
  const handleRescheduleOrCancel = useCallback(
    () => router.push({ pathname: '/sessions/reschedule-cancel', params: { id } }),
    [id],
  );

  return (
    <Screen>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Session details</Text>
      </View>

      <View style={[styles.timeCard, { backgroundColor: colors.brand }]}>
        <Text variant="h6" color="onBrand" style={styles.dateLabel}>
          {session.dateLabel}
        </Text>
        <Text variant="h1" color="onBrand" style={tabularNums}>
          {session.timeRange}
        </Text>
      </View>

      <Card padded={false} style={styles.detailsCard}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Text variant="caption" color="textSecondary">
              {row.label}
            </Text>
            <Text variant="h5" style={tabularNums}>
              {row.value}
            </Text>
          </View>
        ))}
      </Card>

      <View style={styles.spacer} />

      <Button label={`Message ${firstName}`} size="large" fullWidth onPress={handleMessage} />
      <Button
        label="Reschedule or cancel"
        variant="secondary"
        size="large"
        fullWidth
        onPress={handleRescheduleOrCancel}
        style={styles.secondButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingTop: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  timeCard: {
    borderRadius: Radius.card,
    padding: Spacing.s5,
    gap: Spacing.s2,
    marginBottom: Spacing.s5,
  },
  dateLabel: {
    opacity: 0.7,
  },
  detailsCard: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.s4,
    paddingHorizontal: Spacing.s5,
    paddingVertical: Spacing.s4,
  },
  spacer: {
    flex: 1,
  },
  secondButton: {
    marginTop: Spacing.s3,
    marginBottom: Spacing.s2,
  },
});
