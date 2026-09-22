import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type TrainerCurrentPlanBannerProps = {
  title: string;
  subtitle: string;
};

/** Client Detail's "Current plan" summary — solid brand-ink, same eyebrow/fill treatment as TrainerPricingCard. */
export const TrainerCurrentPlanBanner = memo(function TrainerCurrentPlanBanner({
  title,
  subtitle,
}: TrainerCurrentPlanBannerProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.brand, borderRadius: Radius.card }]}>
      <Text variant="h6" color="onBrand" style={styles.eyebrow}>
        Current plan
      </Text>
      <Text variant="h3" color="onBrand">
        {title}
      </Text>
      <Text variant="bodySecondary" color="onBrand" style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: Spacing.s5,
    gap: Spacing.s1,
  },
  eyebrow: {
    opacity: 0.7,
  },
  subtitle: {
    opacity: 0.8,
  },
});
