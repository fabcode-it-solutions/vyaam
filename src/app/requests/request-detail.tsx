import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BID_CARD_HEIGHT, BidCard, type Bid } from '@/components/requests';
import { Badge, BackButton, Button, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Requests/Request Detail — a customer's posted request with bids received
 * so far. Request fields and bids below are illustrative (matches Figma's
 * "Upper body strength coaching" example); needs the real request-detail +
 * bids endpoints, keyed off the `id` route param, rather than static data.
 */

type RequestDetailData = {
  title: string;
  daysLeft: number;
  mode: string;
  location: string;
  schedule: string;
  budgetRange: string;
  genderPreference: string;
  languages: string;
};

const REQUEST: RequestDetailData = {
  title: 'Upper body strength coaching',
  daysLeft: 5,
  mode: 'At home',
  location: 'Sector 14, Hisar',
  schedule: '4 days/week, early morning',
  budgetRange: '₹400–800',
  genderPreference: 'No gender preference',
  languages: 'English, Hindi',
};

const BIDS: Bid[] = [
  {
    id: 'bid-1',
    name: 'Anjali Kaushik',
    initials: 'AK',
    rating: 4.8,
    price: 600,
    packageLabel: '4-session package',
    note: 'I focus on beginner-friendly strength work — happy to adapt around any joint concerns.',
  },
  {
    id: 'bid-2',
    name: 'Rohit Sharma',
    initials: 'RS',
    rating: 4.9,
    price: 750,
    packageLabel: '8-session package',
    note: 'Certified strength coach, 6 years experience with home clients in Hisar.',
  },
  {
    id: 'bid-3',
    name: 'Karan Mehta',
    initials: 'KM',
    rating: 4.6,
    price: 500,
    packageLabel: 'Per session',
    note: 'Flexible timing, can start this week.',
  },
];

export default function RequestDetailScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const handleBidPress = useCallback(
    (bid: Bid) => router.push({ pathname: '/requests/bid-detail', params: { id: bid.id } }),
    [],
  );
  const handleCompare = useCallback(
    () => router.push({ pathname: '/requests/bid-comparison', params: { id } }),
    [id],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Bid>) => <BidCard bid={item} onPress={handleBidPress} />,
    [handleBidPress],
  );
  const keyExtractor = useCallback((item: Bid) => item.id, []);
  const getItemLayout = useCallback(
    (_data: ArrayLike<Bid> | null | undefined, index: number) => ({
      length: BID_CARD_HEIGHT,
      offset: (BID_CARD_HEIGHT + Spacing.s3) * index,
      index,
    }),
    [],
  );

  const ListHeader = (
    <View style={styles.headerCard}>
      <Badge label={`Open for bids · ${REQUEST.daysLeft} days left`} variant="onlineOnly" />

      <View style={styles.requestInfo}>
        <Text variant="h3">{REQUEST.title}</Text>
        <Text variant="bodySecondary" color="textSecondary">
          {REQUEST.mode} · {REQUEST.location} · {REQUEST.schedule}
        </Text>
        <Text variant="bodySecondary" color="textSecondary">
          Budget {REQUEST.budgetRange} · {REQUEST.genderPreference} · {REQUEST.languages}
        </Text>
      </View>

      <Text variant="h4" style={styles.bidsHeading}>
        Bids received ({BIDS.length})
      </Text>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Your request</Text>
      </View>

      <FlatList
        data={BIDS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[
          styles.footer,
          { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + Spacing.s4 },
        ]}>
        <Button label="Compare all bids side by side" variant="secondary" size="large" fullWidth onPress={handleCompare} />
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
    paddingBottom: Spacing.s4,
  },
  headerCard: {
    gap: Spacing.s5,
    paddingBottom: Spacing.s4,
  },
  requestInfo: {
    gap: Spacing.s2,
  },
  bidsHeading: {
    marginTop: Spacing.s2,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s3,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s4,
  },
});
