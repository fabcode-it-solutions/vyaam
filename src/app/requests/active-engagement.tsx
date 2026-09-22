import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Badge, BackButton, Button, CalendarIcon, Card, ChevronIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

/**
 * Requests/Active Engagement — a customer's accepted request with its
 * trainer, package, and next session, opened from My Requests or after
 * accepting a bid. Trainer/package/session fields below are illustrative
 * (matches Figma's Anjali Kaushik engagement), keyed off the `id` route
 * param; needs the real engagement/session endpoints rather than static
 * data, and the trust model for check-in isn't decided yet (see CLAUDE.md's
 * open items).
 */

const TRAINER_ID = 'trainer-1';
const TRAINER_NAME = 'Anjali Kaushik';
const TRAINER_SPECIALTY = 'Yoga & Mobility Coach';
const PACKAGE_LABEL = '4-session package';
const PACKAGE_PRICE = 2200;
const SESSIONS_USED = 2;
const SESSIONS_TOTAL = 4;
const NEXT_SESSION_DATE = 'Saturday, 6 August · 6:00 AM';
const NEXT_SESSION_LOCATION = 'At your home · Sector 14, Hisar';

export default function ActiveEngagementScreen() {
  const { colors } = useTheme();
  const { title } = useLocalSearchParams<{ id?: string; title?: string }>();
  const screenTitle = title || 'Upper body strength';

  const handleOpenTrainerProfile = useCallback(
    () => router.push({ pathname: '/trainer/profile', params: { id: TRAINER_ID } }),
    [],
  );
  const handleMessage = useCallback(
    () => router.push({ pathname: '/chat/conversations-list', params: { name: TRAINER_NAME } }),
    [],
  );
  const handleOpenUpcomingSessions = useCallback(() => router.push('/sessions/upcoming'), []);
  const handleRescheduleOrCancel = useCallback(
    () => router.push({ pathname: '/sessions/reschedule-cancel', params: { id: 'session-1' } }),
    [],
  );

  return (
    <Screen padded={false} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2" numberOfLines={1} style={styles.headerTitle}>
          {screenTitle}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${TRAINER_NAME}’s profile`}
          onPress={handleOpenTrainerProfile}>
          <Card style={styles.trainerCard}>
            <View style={[styles.avatar, { backgroundColor: colors.border }]} />
            <View style={styles.trainerInfo}>
              <View style={styles.nameRow}>
                <Text variant="h5" numberOfLines={1}>
                  {TRAINER_NAME}
                </Text>
                <Badge label="Verified" variant="verified" />
              </View>
              <Text variant="caption" color="textSecondary" numberOfLines={1}>
                {TRAINER_SPECIALTY}
              </Text>
            </View>
            <ChevronIcon size={16} color={colors.textMuted} />
          </Card>
        </Pressable>

        <Card style={styles.packageCard}>
          <View style={styles.packageRow}>
            <Text variant="caption" color="textSecondary">
              {PACKAGE_LABEL}
            </Text>
            <Text variant="h5" style={tabularNums}>
              ₹{PACKAGE_PRICE.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text variant="caption" color="textMuted" style={tabularNums}>
            {SESSIONS_USED} of {SESSIONS_TOTAL} sessions used
          </Text>
        </Card>

        <Text variant="h4" style={styles.sectionTitle}>
          Next session
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View upcoming sessions"
          onPress={handleOpenUpcomingSessions}
          style={[styles.sessionCard, { backgroundColor: colors.brand }]}>
          <CalendarIcon size={18} color={colors.onBrand} />
          <View style={styles.sessionInfo}>
            <Text variant="h5" color="onBrand">
              {NEXT_SESSION_DATE}
            </Text>
            <Text variant="caption" color="onBrand" style={styles.sessionLocation}>
              {NEXT_SESSION_LOCATION}
            </Text>
          </View>
        </Pressable>

        <Button label={`Message ${TRAINER_NAME.split(' ')[0]}`} size="large" fullWidth onPress={handleMessage} />

        <Pressable accessibilityRole="button" onPress={handleRescheduleOrCancel} style={styles.rescheduleLink}>
          <Text variant="caption" color="textMuted" style={styles.rescheduleText}>
            Reschedule or cancel this session
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s4,
  },
  headerTitle: {
    flexShrink: 1,
  },
  content: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s5,
  },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.media,
  },
  trainerInfo: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
  packageCard: {
    gap: Spacing.s3,
  },
  packageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
  },
  sectionTitle: {
    marginTop: -Spacing.s1,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.s3,
    borderRadius: Radius.card,
    padding: Spacing.s5,
  },
  sessionInfo: {
    flex: 1,
    gap: 3,
  },
  sessionLocation: {
    opacity: 0.75,
  },
  rescheduleLink: {
    alignSelf: 'center',
  },
  rescheduleText: {
    textDecorationLine: 'underline',
  },
});
