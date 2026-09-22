import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type BidCreditPackage = {
  key: string;
  credits: number;
  perCreditLabel: string;
  totalLabel: string;
  /** e.g. "Best value" — highlights the row with a brand-ink border and shows a promo badge. */
  highlight?: string;
};

export type BidCreditPackageRowProps = {
  option: BidCreditPackage;
  onPress: (option: BidCreditPackage) => void;
};

/** One purchasable tier on Trainer/Bid Credits — not a radio select, each row buys directly on tap. */
export const BidCreditPackageRow = memo(function BidCreditPackageRow({ option, onPress }: BidCreditPackageRowProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(option), [onPress, option]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${option.credits} credits, ${option.totalLabel}`}
      onPress={handlePress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: option.highlight ? colors.brand : colors.border,
          borderWidth: option.highlight ? 2 : 1,
        },
      ]}>
      <View style={styles.text}>
        <Text variant="h5">{option.credits} credits</Text>
        <Text variant="caption" color="textMuted">
          {option.perCreditLabel} / credit
        </Text>
      </View>
      {option.highlight && <Badge label={option.highlight} variant="promo" />}
      <Text variant="h5" style={tabularNums}>
        {option.totalLabel}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.card,
    padding: Spacing.s4,
    gap: Spacing.s3,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
