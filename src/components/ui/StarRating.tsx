import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { StarIcon } from './StarIcon';

export type StarRatingProps = {
  /** Whole-star rating, 0–5 — reviews don't show half stars in this build. */
  rating: number;
  size?: number;
  max?: number;
};

/** A row of filled/empty stars — review summary and per-review ratings. */
export const StarRating = memo(function StarRating({ rating, size = 12, max = 5 }: StarRatingProps) {
  const { colors } = useTheme();
  const filledCount = Math.round(Math.min(max, Math.max(0, rating)));

  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => (
        <StarIcon key={i} size={size} filled={i < filledCount} color={i < filledCount ? colors.accentDeep : colors.border} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
});
