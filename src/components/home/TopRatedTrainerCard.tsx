import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, CheckIcon, StarIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type TopRatedTrainer = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  distanceKm: number;
  verified: boolean;
  photoUri?: string | number | null;
};

export type TopRatedTrainerCardProps = {
  trainer: TopRatedTrainer;
  onPress: (trainer: TopRatedTrainer) => void;
};

/** Fixed card width — the section scrolls horizontally, so cards can't flex to the row. */
export const TOP_RATED_CARD_WIDTH = 172;

const PHOTO_SIZE = 64;

/** "Anjali Kaushik" -> "Anjali K." — first name plus last-initial, as shown in the Figma cards. */
function formatDisplayName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return fullName;
  return `${parts[0]} ${parts[1][0]}.`;
}

/** One card in the "Top rated near you" horizontal scroller. */
export const TopRatedTrainerCard = memo(function TopRatedTrainerCard({
  trainer,
  onPress,
}: TopRatedTrainerCardProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(trainer), [onPress, trainer]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={trainer.name}
      onPress={handlePress}
      style={styles.wrap}>
      <Card padded={false} style={[styles.card, { borderColor: colors.border }]}>
        <View style={[styles.photo, { borderRadius: Radius.media }]}>
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
            <Text variant="h5" numberOfLines={1} style={styles.name}>
              {formatDisplayName(trainer.name)}
            </Text>
            {trainer.verified && (
              <View style={[styles.verifiedBadge, { backgroundColor: colors.accentDeep }]}>
                <CheckIcon size={9} color={colors.onVerified} />
              </View>
            )}
          </View>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {trainer.specialty}
          </Text>
          <View style={styles.ratingRow}>
            <StarIcon color={colors.accentDeep} />
            <Text variant="caption" color="textSecondary" style={tabularNums}>
              {trainer.rating.toFixed(1)} · {trainer.distanceKm} km
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  wrap: {
    width: TOP_RATED_CARD_WIDTH,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s3,
    gap: Spacing.s3,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s1,
  },
  name: {
    flexShrink: 1,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
});
