import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge, Card, StarIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type DiscoverTrainer = {
  id: string;
  name: string;
  verified: boolean;
  category: string;
  mode: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  photoUri?: string | number | null;
};

const AVATAR_SIZE = 64;

/** Card padding (Spacing.s4 × 2) + avatar — keep in sync with the styles below for `getItemLayout`. */
export const TRAINER_LIST_CARD_HEIGHT = AVATAR_SIZE + Spacing.s4 * 2;

export type TrainerListCardProps = {
  trainer: DiscoverTrainer;
  onPress: (trainer: DiscoverTrainer) => void;
};

/** One row in the Discover trainer-list results. Fixed height for `getItemLayout`. */
export const TrainerListCard = memo(function TrainerListCard({ trainer, onPress }: TrainerListCardProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(trainer), [onPress, trainer]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={trainer.name} onPress={handlePress}>
      <Card padded={false} style={[styles.row, { height: TRAINER_LIST_CARD_HEIGHT }]}>
        <View style={[styles.avatar, { backgroundColor: colors.border }]}>
          {trainer.photoUri != null && (
            <Image
              source={typeof trainer.photoUri === 'string' ? { uri: trainer.photoUri } : trainer.photoUri}
              style={styles.avatar}
              contentFit="cover"
            />
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={styles.nameRow}>
              <Text variant="h5" numberOfLines={1} style={styles.nameText}>
                {trainer.name}
              </Text>
              {trainer.verified && <Badge label="Verified" variant="verified" />}
            </View>
            <Text variant="caption" color="textMuted" style={tabularNums}>
              {trainer.distanceKm} km
            </Text>
          </View>

          <Text variant="caption" color="textSecondary" numberOfLines={1} style={styles.category}>
            {trainer.category} · {trainer.mode}
          </Text>

          <View style={styles.bottomRow}>
            <View style={styles.ratingRow}>
              <StarIcon color={colors.accentDeep} />
              <Text variant="caption" color="textSecondary" style={tabularNums}>
                {trainer.rating.toFixed(1)} ({trainer.reviewCount})
              </Text>
            </View>
            <Text variant="h5" style={tabularNums}>
              ₹{trainer.pricePerSession}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: Radius.media,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.s2,
  },
  nameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
  nameText: {
    flexShrink: 1,
  },
  category: {
    marginTop: -2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
