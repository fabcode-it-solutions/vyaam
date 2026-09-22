import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge, Card, Pill, StarIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type TrainerProfileSummary = {
  name: string;
  verified: boolean;
  specialty: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  city: string;
  modes: string[];
  photoUri?: string | number | null;
};

export type TrainerProfileHeaderProps = {
  trainer: TrainerProfileSummary;
  /** Taps the rating line through to the full Reviews screen — omit to render it as plain text. */
  onPressReviews?: () => void;
};

/**
 * Trainer Profile's identity card — square photo, name/verified badge,
 * specialty, rating/distance, and mode tags. A plain rounded-square photo
 * slot, not `Avatar` — Avatar stays strictly circular per the Brand Guide,
 * this frame uses the same square treatment as the Discover trainer cards.
 */
export const TrainerProfileHeader = memo(function TrainerProfileHeader({ trainer, onPressReviews }: TrainerProfileHeaderProps) {
  const { colors } = useTheme();

  const ratingRow = (
    <View style={styles.ratingRow}>
      <StarIcon color={colors.accentDeep} />
      <Text variant="caption" color="textSecondary" style={tabularNums}>
        {trainer.rating.toFixed(1)} ({trainer.reviewCount}) · {trainer.distanceKm} km · {trainer.city}
      </Text>
    </View>
  );

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.photo, { backgroundColor: colors.border }]}>
          {trainer.photoUri != null && (
            <Image
              source={typeof trainer.photoUri === 'string' ? { uri: trainer.photoUri } : trainer.photoUri}
              style={styles.photo}
              contentFit="cover"
            />
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.nameRow}>
            <Text variant="h3" numberOfLines={1} style={styles.nameText}>
              {trainer.name}
            </Text>
            {trainer.verified && <Badge label="Verified" variant="verified" />}
          </View>
          <Text variant="bodySecondary" color="textSecondary" numberOfLines={1}>
            {trainer.specialty}
          </Text>
          {onPressReviews ? (
            <Pressable accessibilityRole="button" accessibilityLabel="See all reviews" onPress={onPressReviews}>
              {ratingRow}
            </Pressable>
          ) : (
            ratingRow
          )}
        </View>
      </View>

      <View style={styles.modeRow}>
        {trainer.modes.map((mode) => (
          <Pill key={mode} label={mode} selected={false} />
        ))}
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: Spacing.s4,
  },
  topRow: {
    flexDirection: 'row',
    gap: Spacing.s3,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: Radius.media,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: 3,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
  nameText: {
    flexShrink: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.s2,
  },
});
