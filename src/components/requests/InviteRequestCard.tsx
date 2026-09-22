import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import { Spacing } from '@/theme';

export type InviteRequestOption = {
  id: string;
  title: string;
  /** Training location tag shown top-right, e.g. "At home", "At a gym". */
  mode: string;
  /** Combined subtitle line, e.g. "5 bids so far · Posted 2 days ago". */
  detail: string;
};

export type InviteRequestCardProps = {
  request: InviteRequestOption;
  onInvite: (request: InviteRequestOption) => void;
};

/** One open request a trainer can be invited to, on the Invite Trainer screen. */
export const InviteRequestCard = memo(function InviteRequestCard({ request, onInvite }: InviteRequestCardProps) {
  const handleInvite = useCallback(() => onInvite(request), [onInvite, request]);

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <Text variant="h4" style={styles.title}>
          {request.title}
        </Text>
        <Text variant="caption" color="textMuted">
          {request.mode}
        </Text>
      </View>
      <Text variant="caption" color="textSecondary">
        {request.detail}
      </Text>
      <Button label="Invite to this request" variant="secondary" fullWidth onPress={handleInvite} />
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: Spacing.s4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.s3,
  },
  title: {
    flex: 1,
  },
});
