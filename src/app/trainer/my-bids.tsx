import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TrainerBidCard, type TrainerBidStatus, type TrainerBidSummary } from '@/components/trainer';
import { BackButton, Pill, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Trainer/My bids — every bid a trainer has placed, filterable by status.
 * Bids below are illustrative; needs the real bids endpoint (filtered
 * server-side by status) rather than a static list filtered client-side.
 */
const BIDS: TrainerBidSummary[] = [
  { id: 'bid-1', status: 'sent', title: 'Upper body strength coaching', pricePerSession: 600, statusLabel: 'Sent 2 days ago' },
  { id: 'bid-2', status: 'sent', title: 'Weekend gym partner', pricePerSession: 500, statusLabel: 'Sent 5 hours ago' },
  { id: 'bid-3', status: 'accepted', title: 'Beginner yoga, back pain focus', pricePerSession: 600, statusLabel: 'Accepted 1 week ago' },
  { id: 'bid-4', status: 'expired', title: '10K running preparation', pricePerSession: 700, statusLabel: 'Expired 3 days ago' },
];

const TABS: { key: TrainerBidStatus; label: string }[] = [
  { key: 'sent', label: 'Sent' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'expired', label: 'Expired' },
];

export default function TrainerMyBidsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TrainerBidStatus>('sent');

  const bids = useMemo(() => BIDS.filter((bid) => bid.status === activeTab), [activeTab]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<TrainerBidSummary>) => <TrainerBidCard bid={item} />, []);
  const keyExtractor = useCallback((item: TrainerBidSummary) => item.id, []);

  const ListHeader = (
    <View style={styles.tabsRow}>
      {TABS.map((tab) => (
        <Pill key={tab.key} label={tab.label} selected={activeTab === tab.key} onPress={() => setActiveTab(tab.key)} />
      ))}
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">My bids</Text>
      </View>

      <FlatList
        data={bids}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.s2,
    paddingBottom: Spacing.s4,
  },
});
