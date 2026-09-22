import { Redirect, router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TrainerLeadRow,
  TrainerLeadsBanner,
  TrainerStatCard,
  TrainerTabBar,
  type TrainerLead,
  type TrainerTab,
} from '@/components/trainer';
import { BellIcon, IconButton, StarIcon, Text, ReceiptIcon } from '@/components/ui';
import { getHomeRouteForRole } from '@/lib/navigation/roleHome';
import { useSessionStore } from '@/store/useSessionStore';
import { Spacing, useTheme } from '@/theme';

/**
 * Trainer Home — the trainer-mode dashboard reached after switching roles.
 * New-leads count, stats, and recent leads below are illustrative; needs
 * the real leads/earnings endpoints rather than fixed mock data.
 */
const NEW_LEADS_COUNT = 6;
const MONTHLY_EARNINGS = '₹12,400';
const RATING = 4.8;
const REVIEW_COUNT = 63;

const RECENT_LEADS: TrainerLead[] = [
  { id: 'lead-1', title: 'Upper body strength coaching', mode: 'At home', distanceKm: 2.3, priceRange: '₹400–800' },
  { id: 'lead-2', title: 'Beginner yoga, back pain focus', mode: 'At home', distanceKm: 1.8, priceRange: '₹500–700' },
  { id: 'lead-3', title: 'Weekend gym partner', mode: 'At a gym', distanceKm: 3.1, priceRange: '₹300–600' },
];

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function TrainerHomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useSessionStore((s) => s.user);

  const now = useMemo(() => new Date(), []);
  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const greeting = `${greetingFor(now.getHours())}, ${firstName}`;
  const dateLabel = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const handleOpenNotifications = useCallback(() => router.push('/notifications'), []);
  const handleOpenLeads = useCallback(() => router.push('/trainer/leads-list'), []);
  const handleOpenEarnings = useCallback(() => router.push('/trainer/earnings-payouts'), []);
  const handleOpenReviews = useCallback(() => router.push('/trainer/reviews-received'), []);
  const handleLeadPress = useCallback(
    (lead: TrainerLead) => router.push({ pathname: '/trainer/request-detail', params: { id: lead.id } }),
    [],
  );

  const handleNavigateTab = useCallback((tab: TrainerTab) => {
    if (tab === 'home') return;
    if (tab === 'me') {
      router.push('/profile/myprofile');
      return;
    }
    if (tab === 'leads') {
      router.push('/trainer/leads-list');
      return;
    }
    if (tab === 'clients') {
      router.push('/trainer/client-list');
      return;
    }
    router.push('/trainer/earnings-payouts');
  }, []);

  const renderLead = useCallback(
    ({ item }: ListRenderItemInfo<TrainerLead>) => <TrainerLeadRow lead={item} onPress={handleLeadPress} />,
    [handleLeadPress],
  );
  const keyExtractor = useCallback((item: TrainerLead) => item.id, []);

  if (user && user.activeRole !== 'trainer') {
    return <Redirect href={getHomeRouteForRole(user.activeRole)} />;
  }

  const ListHeader = (
    <View style={styles.header}>
      <View style={styles.greetingRow}>
        <View style={styles.greetingText}>
          <Text variant="h1">{greeting}</Text>
          <Text variant="bodySecondary" color="textSecondary">
            {dateLabel}
          </Text>
        </View>
        <View>
          <IconButton
            accessibilityLabel="Notifications"
            icon={<BellIcon size={22} color={colors.textPrimary} />}
            variant="surface"
            onPress={handleOpenNotifications}
          />
          <View style={[styles.notificationDot, { backgroundColor: colors.accent, borderColor: colors.background }]} />
        </View>
      </View>

      <TrainerLeadsBanner
        count={NEW_LEADS_COUNT}
        subtitle="Within 5 km, matching your filters"
        onPress={handleOpenLeads}
      />

      <View style={styles.statsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View earnings and payouts"
          onPress={handleOpenEarnings}
          style={styles.statPressable}>
          <TrainerStatCard
            icon={<ReceiptIcon size={20} color={colors.textMuted} />}
            value={MONTHLY_EARNINGS}
            label="This month"
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View reviews received"
          onPress={handleOpenReviews}
          style={styles.statPressable}>
          <TrainerStatCard
            icon={<StarIcon size={16} color={colors.accentDeep} />}
            value={RATING.toFixed(1)}
            label={`${REVIEW_COUNT} reviews`}
          />
        </Pressable>
      </View>

      <Text variant="h4" style={styles.sectionTitle}>
        Recent leads
      </Text>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <FlatList
        data={RECENT_LEADS}
        renderItem={renderLead}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <TrainerTabBar active="home" onNavigate={handleNavigateTab} />
    </View>
  );
}

function ItemSeparator() {
  return <View style={{ height: Spacing.s3 }} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
  },
  header: {
    gap: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s2,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.s3,
  },
  greetingText: {
    flex: 1,
    gap: Spacing.s1,
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.s3,
  },
  statPressable: {
    flex: 1,
  },
  sectionTitle: {
    marginTop: Spacing.s2,
  },
});
