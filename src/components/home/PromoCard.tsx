import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge, Card, ChevronIcon, PhotoSlot, StarIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type PromoCardData = {
  id: string;
  tag: string;
  title: string;
  trainerName: string;
  specialty: string;
  rating: number;
  distanceKm: number;
  ctaLabel: string;
  photoUri?: string | number | null;
};

export type PromoCardProps = {
  promo: PromoCardData;
  onPress: (promo: PromoCardData) => void;
};

/**
 * One offer/batch/free-session tile on the Home feed. Per CLAUDE.md's flagged
 * gap, this always uses the single reusable `Badge` promo tint — not the
 * different one-off tag colours (orange/green/teal) drawn per-card in the
 * static Figma frames.
 */
export const PromoCard = memo(function PromoCard({ promo, onPress }: PromoCardProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(promo), [onPress, promo]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={promo.title} onPress={handlePress}>
      <Card style={styles.card}>
        <View style={[styles.thumbnail, { borderRadius: Radius.sm }]}>
          <PhotoSlot uri={promo.photoUri} iconSize={26} />
        </View>
        <View style={styles.body}>
          <Badge label={promo.tag} variant="promo" />
          <Text variant="h5" numberOfLines={2} style={styles.title}>
            {promo.title}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {promo.trainerName} · {promo.specialty}
          </Text>
          <View style={styles.ratingRow}>
            <StarIcon color={colors.accentDeep} />
            <Text variant="caption" color="textSecondary" style={tabularNums}>
              {promo.rating.toFixed(1)} · {promo.distanceKm}km away
            </Text>
          </View>
          <View style={styles.ctaRow}>
            <Text variant="caption" color="accentDeep">
              {promo.ctaLabel}
            </Text>
            <ChevronIcon size={12} color={colors.accentDeep} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.s3,
  },
  thumbnail: {
    width: 72,
    height: 72,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: Spacing.s1,
  },
  title: {
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
});
