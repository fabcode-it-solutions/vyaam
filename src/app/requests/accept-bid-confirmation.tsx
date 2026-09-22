import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Card, LockIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

/**
 * Requests/Accept Bid Confirmation — final confirm step before accepting a
 * trainer's bid, opened from Bid Detail's "Accept this bid". Trainer summary
 * below is illustrative (matches Bid Detail's mock bids), keyed off the `id`
 * route param; needs the real bid-accept endpoint — "Confirm and accept"
 * currently just moves straight to Sessions/Check-in rather than actually
 * persisting anything.
 */

type BidSummary = {
  name: string;
  price: number;
  packageLabel: string;
};

const BID_SUMMARIES: Record<string, BidSummary> = {
  'bid-1': { name: 'Anjali Kaushik', price: 600, packageLabel: '4-session package' },
  'bid-2': { name: 'Rohit Sharma', price: 750, packageLabel: '8-session package' },
  'bid-3': { name: 'Karan Mehta', price: 500, packageLabel: 'Per session' },
  'bid-4': { name: 'Meera Iyer', price: 650, packageLabel: '6-session package' },
  'bid-5': { name: 'Vikram Singh', price: 800, packageLabel: '10-session package' },
};

export default function AcceptBidConfirmationScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const bid = (id && BID_SUMMARIES[id]) || BID_SUMMARIES['bid-1'];
  const firstName = bid.name.split(' ')[0];

  const handleConfirm = useCallback(
    () => router.replace({ pathname: '/sessions/check-in', params: { id } }),
    [id],
  );
  const handleNotNow = useCallback(() => router.back(), []);

  return (
    <Screen>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Confirm acceptance</Text>
      </View>

      <Card style={styles.trainerCard}>
        <View style={[styles.avatar, { backgroundColor: colors.border }]} />
        <View style={styles.trainerInfo}>
          <Text variant="h5" numberOfLines={1}>
            {bid.name}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1} style={tabularNums}>
            ₹{bid.price}/session · {bid.packageLabel}
          </Text>
        </View>
      </Card>

      <Card style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentTint }]}>
            <LockIcon open size={18} color={colors.accentDeep} />
          </View>
          <Text variant="h5">What happens next</Text>
        </View>
        <Text variant="bodySecondary" color="textSecondary">
          Accepting unlocks direct messaging with {firstName}, and this request closes to other bids. You can
          still cancel or reschedule later.
        </Text>
      </Card>

      <View style={styles.spacer} />

      <Button label="Confirm and accept" size="large" fullWidth onPress={handleConfirm} />
      <Button label="Not now" variant="ghost" size="large" fullWidth onPress={handleNotNow} style={styles.notNow} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingTop: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    marginBottom: Spacing.s4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.media,
  },
  trainerInfo: {
    flex: 1,
    gap: 3,
  },
  infoCard: {
    gap: Spacing.s3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
  },
  notNow: {
    marginTop: Spacing.s2,
    marginBottom: Spacing.s2,
  },
});
