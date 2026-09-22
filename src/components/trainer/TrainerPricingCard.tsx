import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type TrainerPricingCardProps = {
  pricePerSession: number;
  packagePrice: number;
  packageSessions: number;
};

function formatRupees(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

/** Trainer Profile's "Pricing" card — solid brand-ink fill, the one place price figures get top billing. */
export const TrainerPricingCard = memo(function TrainerPricingCard({
  pricePerSession,
  packagePrice,
  packageSessions,
}: TrainerPricingCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.brand, borderRadius: Radius.card }]}>
      <View style={styles.column}>
        <Text variant="h6" color="onBrand" style={styles.eyebrow}>
          Per session
        </Text>
        <Text variant="h2" color="onBrand" style={tabularNums}>
          {formatRupees(pricePerSession)}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.onBrand }]} />

      <View style={styles.column}>
        <Text variant="h6" color="onBrand" style={styles.eyebrow}>
          {packageSessions}-session package
        </Text>
        <Text variant="h2" color="onBrand" style={tabularNums}>
          {formatRupees(packagePrice)}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s5,
    gap: Spacing.s5,
  },
  column: {
    flex: 1,
    gap: Spacing.s1,
  },
  eyebrow: {
    opacity: 0.7,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    opacity: 0.2,
  },
});
