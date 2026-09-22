import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BidCompareCard, type CompareBid } from '@/components/requests';
import { BackButton, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Requests/Bid Comparison — swipeable side-by-side view of the bids on a
 * posted request, opened from Request Detail's "Compare all bids side by
 * side". Bids below are illustrative (same request as Request Detail, sorted
 * by price ascending); needs the real bids endpoint, keyed off the `id`
 * route param, rather than a static list. "Best rated" is a placeholder flag
 * — needs a real ranking signal from that endpoint, not a hardcoded pick.
 */

const PEEK_WIDTH = 40;
const CARD_GAP = Spacing.s3;

const BIDS: CompareBid[] = [
  {
    id: 'bid-3',
    name: 'Karan Mehta',
    initials: 'KM',
    rating: 4.6,
    price: 500,
    packageLabel: 'Per session',
    note: 'Flexible timing, can start this week.',
  },
  {
    id: 'bid-1',
    name: 'Anjali Kaushik',
    initials: 'AK',
    rating: 4.8,
    price: 600,
    packageLabel: '4-session package',
    note: 'I focus on beginner-friendly strength work — happy to adapt around any joint concerns.',
    isBestValue: true,
  },
  {
    id: 'bid-4',
    name: 'Meera Iyer',
    initials: 'MI',
    rating: 4.7,
    price: 650,
    packageLabel: '6-session package',
    note: 'Certified strength and conditioning coach, flexible morning slots.',
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
    id: 'bid-5',
    name: 'Vikram Singh',
    initials: 'VS',
    rating: 4.5,
    price: 800,
    packageLabel: '10-session package',
    note: 'Specialises in progressive overload programs for beginners.',
  },
];

export default function BidComparisonScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  useLocalSearchParams<{ id?: string }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const cardWidth = width - Spacing.s4 * 2 - PEEK_WIDTH;
  const cardStep = cardWidth + CARD_GAP;

  const handleBidPress = useCallback(
    (bid: CompareBid) => router.push({ pathname: '/requests/bid-detail', params: { id: bid.id } }),
    [],
  );

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / cardStep);
      setCurrentIndex(Math.min(Math.max(index, 0), BIDS.length - 1));
    },
    [cardStep],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CompareBid>) => <BidCompareCard bid={item} width={cardWidth} onPress={handleBidPress} />,
    [cardWidth, handleBidPress],
  );
  const keyExtractor = useCallback((item: CompareBid) => item.id, []);
  const getItemLayout = useCallback(
    (_data: ArrayLike<CompareBid> | null | undefined, index: number) => ({
      length: cardStep,
      offset: cardStep * index,
      index,
    }),
    [cardStep],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Compare bids</Text>
      </View>

      <Text variant="bodySecondary" color="textSecondary" style={styles.subtitle}>
        Swipe to compare · {currentIndex + 1} of {BIDS.length} shown, sorted by price
      </Text>

      <FlatList
        data={BIDS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardStep}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        ItemSeparatorComponent={CardSeparator}
        contentContainerStyle={styles.listContent}
      />

      <Text variant="caption" color="textMuted" style={[styles.footnote, { paddingBottom: insets.bottom + Spacing.s4 }]}>
        Open a bid to accept, message the trainer, or see the full pitch.
      </Text>
    </View>
  );
}

function CardSeparator() {
  return <View style={{ width: CARD_GAP }} />;
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
  subtitle: {
    paddingHorizontal: Spacing.s4,
    marginBottom: Spacing.s5,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
  },
  footnote: {
    textAlign: 'center',
    paddingHorizontal: Spacing.s6,
    paddingTop: Spacing.s5,
  },
});
