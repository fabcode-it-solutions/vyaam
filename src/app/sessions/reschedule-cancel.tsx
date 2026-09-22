import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, BanIcon, Button, Card, LocationPinIcon, RefreshIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Sessions/Reschedule or Cancel — opened from Session Detail's "Reschedule
 * or cancel". Session summary below is illustrative (matches Session
 * Detail's mock sessions), keyed off the `id` route param; needs the real
 * reschedule/cancel endpoints — the trust model and cutoff-window rules
 * shown here (12 hours) are illustrative copy from Figma, not confirmed
 * product rules.
 */

type ManageSessionData = {
  dateTimeLabel: string;
  location: string;
  trainerName: string;
};

const MANAGE_SESSIONS: Record<string, ManageSessionData> = {
  'session-1': { dateTimeLabel: 'Tomorrow, 6:00 AM', location: 'At your home', trainerName: 'Anjali Kaushik' },
  'session-2': { dateTimeLabel: 'Thu, 7 Aug · 7:00 PM', location: 'At your home', trainerName: 'Rohit Sharma' },
  'session-3': { dateTimeLabel: 'Sat, 9 Aug · 6:00 AM', location: 'At your home', trainerName: 'Anjali Kaushik' },
};

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function ManageSessionScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const session = (id && MANAGE_SESSIONS[id]) || MANAGE_SESSIONS['session-1'];

  const handlePickNewTime = useCallback(() => comingSoon('Rescheduling this session'), []);
  const handleCancelSession = useCallback(() => comingSoon('Cancelling this session'), []);

  return (
    <Screen>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Manage session</Text>
      </View>

      <Card style={styles.summaryCard}>
        <Text variant="h5">{session.dateTimeLabel}</Text>
        <View style={styles.locationRow}>
          <LocationPinIcon size={14} color={colors.textMuted} />
          <Text variant="caption" color="textSecondary">
            {session.location} · {session.trainerName}
          </Text>
        </View>
      </Card>

      <Card style={styles.actionCard}>
        <View style={styles.actionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: colors.border }]}>
            <RefreshIcon size={18} color={colors.textPrimary} />
          </View>
          <View style={styles.actionText}>
            <Text variant="h5">Reschedule</Text>
            <Text variant="caption" color="textSecondary">
              Free up to 12 hours before the session
            </Text>
          </View>
        </View>
        <Button label="Pick a new time" variant="secondary" fullWidth onPress={handlePickNewTime} />
      </Card>

      <Card style={styles.actionCard}>
        <View style={styles.actionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: colors.dangerTint }]}>
            <BanIcon size={18} color={colors.danger} />
          </View>
          <View style={styles.actionText}>
            <Text variant="h5">Cancel session</Text>
            <Text variant="caption" color="textSecondary">
              Cancelling within 12 hours may forfeit this session
            </Text>
          </View>
        </View>
        <Button label="Cancel this session" variant="destructive" fullWidth onPress={handleCancelSession} />
      </Card>
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
  summaryCard: {
    gap: Spacing.s2,
    marginBottom: Spacing.s5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s1,
  },
  actionCard: {
    gap: Spacing.s4,
    marginBottom: Spacing.s4,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    gap: 2,
  },
});
