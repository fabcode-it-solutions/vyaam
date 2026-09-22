import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar, Card, StarRating, Text } from '@/components/ui';
import { Spacing } from '@/theme';

export type TrainerReview = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  timeAgo: string;
  text: string;
};

export type ReviewCardProps = {
  review: TrainerReview;
};

/** One customer review on the Reviews screen. Fixed avatar/name/time header + star row + free-text body. */
export const ReviewCard = memo(function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar size="list" initials={review.initials} seed={review.id} />
        <View style={styles.nameColumn}>
          <Text variant="h5" numberOfLines={1}>
            {review.name}
          </Text>
          <StarRating rating={review.rating} size={11} />
        </View>
        <Text variant="caption" color="textMuted">
          {review.timeAgo}
        </Text>
      </View>
      <Text variant="bodySecondary" color="textSecondary">
        {review.text}
      </Text>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: Spacing.s3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  nameColumn: {
    flex: 1,
    gap: 3,
  },
});
