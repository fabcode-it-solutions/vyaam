import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge, Card, Text, type BadgeVariant } from '@/components/ui';
import { Spacing, tabularNums } from '@/theme';

export type TrainerBidStatus = 'sent' | 'accepted' | 'expired';

export type TrainerBidSummary = {
  id: string;
  status: TrainerBidStatus;
  title: string;
  pricePerSession: number;
  statusLabel: string;
};

export type TrainerBidCardProps = {
  bid: TrainerBidSummary;
};

const STATUS_BADGE: Record<TrainerBidStatus, { label: string; variant: BadgeVariant }> = {
  sent: { label: 'Sent', variant: 'onlineOnly' },
  accepted: { label: 'Accepted', variant: 'verified' },
  expired: { label: 'Expired', variant: 'draft' },
};

/** One row on Trainer/My bids. */
export const TrainerBidCard = memo(function TrainerBidCard({ bid }: TrainerBidCardProps) {
  const status = STATUS_BADGE[bid.status];

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <Badge label={status.label} variant={status.variant} />
        <View style={styles.priceStack}>
          <Text variant="h5" style={tabularNums}>
            ₹{bid.pricePerSession.toLocaleString('en-IN')}
          </Text>
          <Text variant="caption" color="textMuted">
            / session
          </Text>
        </View>
      </View>
      <Text variant="h5" style={styles.title}>
        {bid.title}
      </Text>
      <Text variant="caption" color="textMuted">
        {bid.statusLabel}
      </Text>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: Spacing.s1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  priceStack: {
    alignItems: 'flex-end',
  },
  title: {
    marginTop: Spacing.s2,
  },
});
