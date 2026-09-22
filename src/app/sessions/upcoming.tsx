import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SessionCard, type UpcomingSession } from '@/components/sessions';
import { BackButton, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Sessions/Upcoming — every booked session across all active engagements,
 * grouped by date. Sessions below are illustrative; needs the real sessions
 * endpoint (Style A pagination) rather than a static list.
 */

type DateGroup = 'tomorrow' | 'thisWeek';

const SESSIONS: (UpcomingSession & { dateGroup: DateGroup })[] = [
  {
    id: 'session-1',
    trainerName: 'Anjali Kaushik',
    dateTimeLabel: '6:00 AM',
    sessionLabel: 'Session 3 of 4',
    dateGroup: 'tomorrow',
  },
  {
    id: 'session-2',
    trainerName: 'Rohit Sharma',
    dateTimeLabel: 'Thu, 7 Aug · 7:00 PM',
    sessionLabel: 'Session 5 of 8',
    dateGroup: 'thisWeek',
  },
  {
    id: 'session-3',
    trainerName: 'Anjali Kaushik',
    dateTimeLabel: 'Sat, 9 Aug · 6:00 AM',
    sessionLabel: 'Session 4 of 4',
    dateGroup: 'thisWeek',
  },
];

const DATE_GROUPS: { key: DateGroup; label: string }[] = [
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'thisWeek', label: 'This week' },
];

type ListItem = { kind: 'header'; label: string } | { kind: 'session'; data: UpcomingSession };

export default function UpcomingSessionsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleSessionPress = useCallback(
    (session: UpcomingSession) => router.push({ pathname: '/sessions/session-detail', params: { id: session.id } }),
    [],
  );

  const listItems = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    for (const { key, label } of DATE_GROUPS) {
      const group = SESSIONS.filter((s) => s.dateGroup === key);
      if (group.length === 0) continue;
      items.push({ kind: 'header', label });
      for (const session of group) items.push({ kind: 'session', data: session });
    }
    return items;
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListItem>) => {
      if (item.kind === 'header') {
        return (
          <Text variant="h6" color="textMuted" style={styles.sectionHeader}>
            {item.label}
          </Text>
        );
      }
      return <SessionCard session={item.data} onPress={handleSessionPress} />;
    },
    [handleSessionPress],
  );

  const keyExtractor = useCallback(
    (item: ListItem) => (item.kind === 'header' ? `hdr-${item.label}` : item.data.id),
    [],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Upcoming sessions</Text>
      </View>

      <FlatList
        data={listItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: Spacing.s4,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s2,
  },
  sectionHeader: {
    marginTop: Spacing.s3,
    marginBottom: Spacing.s1,
  },
});
