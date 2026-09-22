import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, StarRating, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type RatingBreakdownRow = {
  stars: 5 | 4 | 3 | 2 | 1;
  /** Share of all reviews at this star count, 0–100. */
  percent: number;
};

export type ReviewSummaryCardProps = {
  average: number;
  totalReviews: number;
  breakdown: RatingBreakdownRow[];
};

/** Reviews screen's header card — average + star row on the left, per-star distribution bars on the right. */
export const ReviewSummaryCard = memo(function ReviewSummaryCard({ average, totalReviews, breakdown }: ReviewSummaryCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.averageColumn}>
        <Text variant="h1" style={tabularNums}>
          {average.toFixed(1)}
        </Text>
        <StarRating rating={average} size={13} />
        <Text variant="caption" color="textSecondary">
          {totalReviews} reviews
        </Text>
      </View>

      <View style={styles.breakdownColumn}>
        {breakdown.map((row) => (
          <BreakdownBar key={row.stars} row={row} />
        ))}
      </View>
    </Card>
  );
});

const BreakdownBar = memo(function BreakdownBar({ row }: { row: RatingBreakdownRow }) {
  const { colors } = useTheme();
  return (
    <View style={styles.barRow}>
      <Text variant="caption" color="textMuted" style={styles.barLabel}>
        {row.stars}
      </Text>
      <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.barFill, { width: `${row.percent}%`, backgroundColor: colors.accentDeep }]} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.s5,
  },
  averageColumn: {
    gap: Spacing.s1,
  },
  breakdownColumn: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
  barLabel: {
    width: 8,
  },
  barTrack: {
    flex: 1,
    height: 5,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
