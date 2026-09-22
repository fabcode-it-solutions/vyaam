import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Card, StarIcon, Text } from '@/components/ui';
import { Spacing, Typography, tabularNums, useTheme } from '@/theme';

export type Bid = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  price: number;
  /** e.g. "4-session package", "8-session package", "Per session". */
  packageLabel: string;
  note: string;
};

const NOTE_LINES = 2;
/** Taller of the avatar (38) and the name + rating text stack — keep in sync with `headerRow` below. */
const HEADER_ROW_HEIGHT = Typography.h5.lineHeight + 3 + Typography.caption.lineHeight;

/** Card padding + header row + gap + two-line note — keep in sync with the styles below for `getItemLayout`. */
export const BID_CARD_HEIGHT =
  Spacing.s5 * 2 + HEADER_ROW_HEIGHT + Spacing.s3 + Typography.bodySecondary.lineHeight * NOTE_LINES;

export type BidCardProps = {
  bid: Bid;
  onPress: (bid: Bid) => void;
};

/** One trainer's bid on a posted request — avatar/name/rating, price + package, and a short note. Fixed height for `getItemLayout`. */
export const BidCard = memo(function BidCard({ bid, onPress }: BidCardProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(bid), [onPress, bid]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${bid.name}’s bid`} onPress={handlePress}>
      <Card style={[styles.card, { height: BID_CARD_HEIGHT }]}>
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
          <View style={styles.priceColumn}>
            <Text variant="h5" style={tabularNums}>
              ₹{bid.price}
            </Text>
            <Text variant="caption" color="textMuted" numberOfLines={1}>
              {bid.packageLabel}
            </Text>
          </View>
        </View>
        <Text variant="bodySecondary" color="textSecondary" numberOfLines={NOTE_LINES}>
          {bid.note}
        </Text>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: Spacing.s3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    height: HEADER_ROW_HEIGHT,
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
  priceColumn: {
    alignItems: 'flex-end',
    gap: 3,
  },
});
