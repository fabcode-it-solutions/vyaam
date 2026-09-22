import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Card, CheckIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Sessions/Check-in — confirmation shown after a session is logged, keyed
 * off the `id` route param. This only covers the result screen; what
 * actually triggers it (self-report vs. mutual confirmation vs. geofence)
 * is an open product decision per CLAUDE.md's known gaps, so no check-in
 * action UI is wired up ahead of that call.
 */

type CheckInData = {
  trainerName: string;
  sessionNumber: number;
  sessionTotal: number;
};

const CHECK_INS: Record<string, CheckInData> = {
  'session-1': { trainerName: 'Anjali Kaushik', sessionNumber: 3, sessionTotal: 4 },
  'session-2': { trainerName: 'Rohit Sharma', sessionNumber: 5, sessionTotal: 8 },
  'session-3': { trainerName: 'Anjali Kaushik', sessionNumber: 4, sessionTotal: 4 },
};

export default function SessionCheckInScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const session = (id && CHECK_INS[id]) || CHECK_INS['session-1'];
  const remaining = session.sessionTotal - session.sessionNumber;
  const remainingLabel =
    remaining <= 0
      ? 'This was your last session in this package.'
      : `${remaining} session${remaining === 1 ? '' : 's'} remaining in this package`;

  const handleLeaveReview = useCallback(
    () => router.push({ pathname: '/sessions/post-session-review', params: { id } }),
    [id],
  );
  const handleMaybeLater = useCallback(() => router.back(), []);

  return (
    <Screen>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={styles.body}>
        <View style={[styles.iconOuter, { backgroundColor: colors.verifiedTint }]}>
          <CheckIcon size={32} color={colors.verified} />
        </View>
        <Text variant="h2" style={styles.title}>
          Session confirmed!
        </Text>
        <Text variant="bodySecondary" color="textSecondary" style={styles.subtitle}>
          Session {session.sessionNumber} of {session.sessionTotal} with {session.trainerName} is logged.
        </Text>

        <Card style={styles.remainingCard}>
          <Text variant="caption" color="textSecondary" style={styles.remainingText}>
            {remainingLabel}
          </Text>
        </Card>
      </View>

      <Button label="Leave a review" size="large" fullWidth onPress={handleLeaveReview} />
      <Button
        label="Maybe later"
        variant="ghost"
        size="large"
        fullWidth
        onPress={handleMaybeLater}
        style={styles.maybeLater}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.s2,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.s6,
  },
  iconOuter: {
    width: 84,
    height: 84,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: Spacing.s5,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: Spacing.s2,
    textAlign: 'center',
  },
  remainingCard: {
    marginTop: Spacing.s6,
    alignSelf: 'stretch',
  },
  remainingText: {
    textAlign: 'center',
  },
  maybeLater: {
    marginTop: Spacing.s1,
    marginBottom: Spacing.s2,
  },
});
