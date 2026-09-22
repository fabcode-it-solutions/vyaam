import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type TrainerLeadsBannerProps = {
  count: number;
  subtitle: string;
  onPress: () => void;
};

/** Trainer Home's "New leads" call-to-action — solid brand-ink, mirrors TrainerPricingCard's fill/eyebrow treatment. */
export const TrainerLeadsBanner = memo(function TrainerLeadsBanner({ count, subtitle, onPress }: TrainerLeadsBannerProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${count} new leads nearby`}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.brand, borderRadius: Radius.card }]}>
      <View style={styles.body}>
        <Text variant="h6" color="onBrand" style={styles.eyebrow}>
          New leads
        </Text>
        <Text variant="h3" color="onBrand">
          {count} nearby
        </Text>
        <Text variant="bodySecondary" color="onBrand" style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
      <ChevronIcon size={18} color={colors.onBrand} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s5,
    gap: Spacing.s3,
  },
  body: {
    flex: 1,
    gap: Spacing.s1,
  },
  eyebrow: {
    opacity: 0.7,
  },
  subtitle: {
    opacity: 0.8,
  },
});
