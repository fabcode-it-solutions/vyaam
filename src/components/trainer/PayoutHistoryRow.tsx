import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, CheckIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type Payout = {
  id: string;
  dateLabel: string;
  status: string;
  amount: number;
};

export type PayoutHistoryRowProps = {
  payout: Payout;
};

/** One completed payout on Trainer/Earnings — same verified check-dot as TrainerCertificationList. */
export const PayoutHistoryRow = memo(function PayoutHistoryRow({ payout }: PayoutHistoryRowProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={[styles.checkDot, { backgroundColor: colors.verifiedTint }]}>
        <CheckIcon size={13} color={colors.verified} />
      </View>
      <View style={styles.body}>
        <Text variant="h5" numberOfLines={1}>
          {payout.dateLabel}
        </Text>
        <Text variant="caption" color="textMuted">
          {payout.status}
        </Text>
      </View>
      <Text variant="h5" style={tabularNums}>
        ₹{payout.amount.toLocaleString('en-IN')}
      </Text>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  checkDot: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
});
