import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Badge, Card, StarIcon, Text } from '@/components/ui';
import { Spacing, tabularNums, useTheme } from '@/theme';

export type CompareBid = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  price: number;
  /** e.g. "4-session package", "8-session package", "Per session". */
  packageLabel: string;
  note: string;
  /** Flags the one "Best rated" card in the deck — illustrative today; needs a real ranking signal from the bids endpoint. */
  isBestValue?: boolean;
};

/** Reserved above every card so the floating "Best rated" ribbon doesn't shift card tops out of alignment. */
export const BID_COMPARE_BADGE_SPACE = Spacing.s5;

export type BidCompareCardProps = {
  bid: CompareBid;
  width: number;
  onPress: (bid: CompareBid) => void;
};

/** One full "page" in the swipeable bid-comparison carousel. */
export const BidCompareCard = memo(function BidCompareCard({ bid, width, onPress }: BidCompareCardProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(bid), [onPress, bid]);

  return (
    <View style={{ width, paddingTop: BID_COMPARE_BADGE_SPACE }}>
      {bid.isBestValue && (
        <View style={styles.badgeWrap}>
          <Badge label="Best rated" variant="promo" />
        </View>
      )}
      <Pressable accessibilityRole="button" accessibilityLabel={`${bid.name}’s bid`} onPress={handlePress}>
        <Card style={[styles.card, bid.isBestValue && { borderColor: colors.verified, borderWidth: 1.5 }]}>
          <View style={styles.headerRow}>
            <Avatar size="list" initials={bid.initials} seed={bid.id} />
            <View style={styles.nameColumn}>
              <Text variant="h5" numberOfLines={1}>
                {bid.name}
              </Text>
              <View style={styles.ratingRow}>
                <StarIcon size={12} color={colors.accentDeep} />
                <Text variant="caption" color="textSecondary" style={tabularNums}>
                  {bid.rating.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.priceBlock}>
            <Text variant="h1" style={tabularNums}>
              ₹{bid.price}
            </Text>
            <Text variant="bodySecondary" color="textMuted">
              {bid.packageLabel}
            </Text>
          </View>

          <Text variant="bodySecondary" color="textSecondary">
            {bid.note}
          </Text>
        </Card>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  badgeWrap: {
    position: 'absolute',
    top: 0,
    left: Spacing.s5,
    zIndex: 1,
  },
  card: {
    gap: Spacing.s4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  nameColumn: {
    flex: 1,
    gap: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  divider: {
    height: 1,
  },
  priceBlock: {
    gap: 2,
  },
});
