import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Card, StarIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

import type { DiscoverTrainer } from './TrainerListCard';

const PHOTO_SIZE = 56;
/** How much of the next card peeks in from the trailing edge, signalling the row scrolls. */
const PEEK_WIDTH = 40;

export type MapTrainerCardProps = {
  trainer: DiscoverTrainer;
  onPress: (trainer: DiscoverTrainer) => void;
};

/** Compact horizontal card for the Discover map view's "N trainers in this area" sheet. */
export const MapTrainerCard = memo(function MapTrainerCard({ trainer, onPress }: MapTrainerCardProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const handlePress = useCallback(() => onPress(trainer), [onPress, trainer]);
  const cardWidth = width - Spacing.s6 * 2 - PEEK_WIDTH;

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={trainer.name} onPress={handlePress} style={{ width: cardWidth }}>
      <Card style={styles.card}>
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
          <Text variant="h5" numberOfLines={1}>
            {trainer.name}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {trainer.category} · {trainer.mode}
          </Text>
          <View style={styles.metaRow}>
            <StarIcon color={colors.accentDeep} />
            <Text variant="caption" color="textSecondary" style={tabularNums}>
              {trainer.rating.toFixed(1)} · {trainer.distanceKm} km · ₹{trainer.pricePerSession}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: Radius.media,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
});
