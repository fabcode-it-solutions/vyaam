import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WeekDaySelector, type WeekDay } from '@/components/plans';
import { TrainerScheduleSessionRow, type TrainerScheduledSession } from '@/components/trainer';
import { BackButton, ChevronIcon, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Trainer/Schedule — the trainer's booked sessions by day. Week range,
 * days-with-sessions dots, and the sessions below are illustrative (matches
 * Figma's Aug 3–9 example); needs the real schedule endpoint rather than a
 * static single week, and the week-nav arrows just flag that paging to
 * another week isn't wired up yet.
 */
const WEEK_LABEL = 'Aug 3 – Aug 9';
const MONTH_LABEL = 'August';

const DAYS: WeekDay[] = [
  { label: 'Mon', date: 3, hasEvent: true },
  { label: 'Tue', date: 4 },
  { label: 'Wed', date: 5, hasEvent: true },
  { label: 'Thu', date: 6 },
  { label: 'Fri', date: 7, hasEvent: true },
  { label: 'Sat', date: 8, hasEvent: true },
  { label: 'Sun', date: 9 },
];

const FULL_DAY_NAMES: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

const SESSIONS_BY_DATE: Record<number, TrainerScheduledSession[]> = {
  3: [
    { id: 'session-1', time: '6:00 AM', clientName: 'Priya Sharma', subtitle: '45 min · At home' },
    { id: 'session-2', time: '7:00 PM', clientName: 'Karan Mehta', subtitle: '60 min · City Fitness Gym' },
  ],
};

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function TrainerSessionSchedulingScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedDay = DAYS[selectedIndex];
  const sessions = useMemo(() => SESSIONS_BY_DATE[selectedDay.date] ?? [], [selectedDay.date]);
  const dayHeading = `${FULL_DAY_NAMES[selectedDay.label]}, ${selectedDay.date} ${MONTH_LABEL}`;

  const handlePrevWeek = useCallback(() => comingSoon('Viewing another week'), []);
  const handleNextWeek = useCallback(() => comingSoon('Viewing another week'), []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Schedule</Text>
      </View>

      <View style={styles.weekNav}>
        <Pressable accessibilityRole="button" accessibilityLabel="Previous week" hitSlop={8} onPress={handlePrevWeek}>
          <ChevronIcon direction="left" size={18} color={colors.textSecondary} />
        </Pressable>
        <Text variant="h5">{WEEK_LABEL}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Next week" hitSlop={8} onPress={handleNextWeek}>
          <ChevronIcon direction="right" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.dayStrip}>
        <WeekDaySelector days={DAYS} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
      </View>

      <Text variant="h5" style={styles.dayHeading}>
        {dayHeading} · {sessions.length} session{sessions.length === 1 ? '' : 's'}
      </Text>

      <View style={styles.sessions}>
        {sessions.length === 0 ? (
          <Text variant="bodySecondary" color="textMuted" style={styles.emptyLabel}>
            No sessions scheduled.
          </Text>
        ) : (
          sessions.map((session) => <TrainerScheduleSessionRow key={session.id} session={session} />)
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.s6,
    marginBottom: Spacing.s5,
  },
  dayStrip: {
    paddingHorizontal: Spacing.s4,
    marginBottom: Spacing.s5,
  },
  dayHeading: {
    paddingHorizontal: Spacing.s4,
    marginBottom: Spacing.s3,
  },
  sessions: {
    paddingHorizontal: Spacing.s4,
    gap: Spacing.s3,
  },
  emptyLabel: {
    paddingVertical: Spacing.s6,
    textAlign: 'center',
  },
});
