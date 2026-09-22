import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ArrowIcon, Card, CheckIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type NearbyTrainer = {
  id: string;
  name: string;
  category: string;
  mode: string;
  distanceKm: number;
  verified: boolean;
  photoUri?: string | number | null;
};

const THUMB_SIZE = 52;

/** Card padding (Spacing.s4 × 2) + thumbnail — keep in sync with the styles below for `getItemLayout`. */
export const NEARBY_TRAINER_ROW_HEIGHT = THUMB_SIZE + Spacing.s4 * 2;

export type NearbyTrainerRowProps = {
  trainer: NearbyTrainer;
  onPress: (trainer: NearbyTrainer) => void;
};

/** One row in the "Available within 10 km" list. Fixed height for `getItemLayout`. */
export const NearbyTrainerRow = memo(function NearbyTrainerRow({ trainer, onPress }: NearbyTrainerRowProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(trainer), [onPress, trainer]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={trainer.name} onPress={handlePress}>
      <Card padded={false} style={[styles.row, { height: NEARBY_TRAINER_ROW_HEIGHT }]}>
        <View style={styles.thumb}>
          {trainer.photoUri != null && (
            <Image
              source={typeof trainer.photoUri === 'string' ? { uri: trainer.photoUri } : trainer.photoUri}
              style={styles.thumb}
              contentFit="cover"
            />
          )}
        </View>
        <View style={styles.body}>
          <View style={styles.nameRow}>
            <Text variant="h5" numberOfLines={1} style={styles.nameText}>
              {trainer.name}
            </Text>
            {trainer.verified && (
              <View style={[styles.verifiedDot, { backgroundColor: colors.accentDeep, borderRadius: Radius.full }]}>
                <CheckIcon size={9} color={colors.onVerified} />
              </View>
            )}
          </View>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {trainer.category} · {trainer.mode} · {trainer.distanceKm} km
          </Text>
        </View>
        <ArrowIcon direction="right" size={20} color={colors.textPrimary} />
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
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: Radius.media,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
  nameText: {
    flexShrink: 1,
  },
  verifiedDot: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
