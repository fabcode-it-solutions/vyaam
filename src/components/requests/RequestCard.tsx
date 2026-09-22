import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge, type BadgeVariant, Card, ChevronIcon, Text } from '@/components/ui';
import { Spacing, Typography, useTheme } from '@/theme';

export type RequestStatus = 'openForBids' | 'accepted' | 'completed' | 'expired';

export type MyRequest = {
  id: string;
  status: RequestStatus;
  /** Training location tag shown top-right, e.g. "At home", "Outdoors". */
  mode: string;
  title: string;
  /** Combined subtitle line, e.g. "5 bids received · Posted 2 days ago". */
  detail: string;
};

const STATUS_LABEL: Record<RequestStatus, string> = {
  openForBids: 'Open for bids',
  accepted: 'Accepted',
  completed: 'Completed',
  expired: 'Expired',
};

/** Reuses Badge's tint categories for status colour, independent of Badge's own variant names. */
const STATUS_BADGE_VARIANT: Record<RequestStatus, BadgeVariant> = {
  openForBids: 'onlineOnly',
  accepted: 'verified',
  completed: 'draft',
  expired: 'suspended',
};

const BADGE_ROW_HEIGHT = 25;

/** Card padding + badge row + title + subtitle (two `Spacing.s2` gaps between them) — keep in sync with the styles below for `getItemLayout`. */
export const REQUEST_CARD_HEIGHT =
  Spacing.s5 * 2 + BADGE_ROW_HEIGHT + Spacing.s2 * 2 + Typography.h4.lineHeight + Typography.caption.lineHeight;

export type RequestCardProps = {
  request: MyRequest;
  onPress: (request: MyRequest) => void;
};

/** One row on My Requests — status badge + mode, title, and a detail line. Fixed height for `getItemLayout`. */
export const RequestCard = memo(function RequestCard({ request, onPress }: RequestCardProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(request), [onPress, request]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={request.title} onPress={handlePress}>
      <Card style={[styles.card, { height: REQUEST_CARD_HEIGHT }]}>
        <View style={styles.body}>
          <View style={styles.topRow}>
            <Badge label={STATUS_LABEL[request.status]} variant={STATUS_BADGE_VARIANT[request.status]} />
            <Text variant="caption" color="textMuted">
              {request.mode}
            </Text>
          </View>
          <Text variant="h4" numberOfLines={1}>
            {request.title}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {request.detail}
          </Text>
        </View>
        <ChevronIcon size={16} color={colors.textMuted} />
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
  body: {
    flex: 1,
    gap: Spacing.s2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
