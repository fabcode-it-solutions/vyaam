import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayoutHistoryRow, type Payout } from '@/components/trainer';
import { BackButton, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

/**
 * Trainer/Earnings — this month's summary plus payout history. Figures
 * below are illustrative (matches Figma's ₹12,400 example); needs the real
 * earnings/payouts endpoint rather than a static list.
 */
const MONTHLY_EARNINGS = 12400;
const SESSIONS_COMPLETED = 18;
const NEXT_PAYOUT_LABEL = 'Aug 15';

const PAYOUTS: Payout[] = [
  { id: 'payout-1', dateLabel: '15 July 2026', status: 'Paid', amount: 10800 },
  { id: 'payout-2', dateLabel: '15 June 2026', status: 'Paid', amount: 9200 },
  { id: 'payout-3', dateLabel: '15 May 2026', status: 'Paid', amount: 7600 },
];

export default function TrainerEarningsPayoutsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Earnings</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.summaryCard, { backgroundColor: colors.brand, borderRadius: Radius.card }]}>
          <Text variant="h6" color="onBrand" style={styles.eyebrow}>
            This month
          </Text>
          <Text variant="h1" color="onBrand" style={tabularNums}>
            ₹{MONTHLY_EARNINGS.toLocaleString('en-IN')}
          </Text>
          <Text variant="bodySecondary" color="onBrand" style={styles.summarySubtitle}>
            {SESSIONS_COMPLETED} sessions completed · Next payout {NEXT_PAYOUT_LABEL}
          </Text>
        </View>

        <Text variant="h5" style={styles.sectionTitle}>
          Payout history
        </Text>
        <View style={styles.rows}>
          {PAYOUTS.map((payout) => (
            <PayoutHistoryRow key={payout.id} payout={payout} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  content: {
    paddingHorizontal: Spacing.s4,
  },
  summaryCard: {
    padding: Spacing.s5,
    gap: Spacing.s1,
    marginBottom: Spacing.s6,
  },
  eyebrow: {
    opacity: 0.7,
  },
  summarySubtitle: {
    opacity: 0.8,
  },
  sectionTitle: {
    marginBottom: Spacing.s3,
  },
  rows: {
    gap: Spacing.s3,
  },
});
