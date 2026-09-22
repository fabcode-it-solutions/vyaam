import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BidCreditPackageRow, TrainerCertificationList, type BidCreditPackage } from '@/components/trainer';
import { BackButton, Button, Card, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

/**
 * Trainer/Bid Credits — buy more credits or go unlimited with Pro Trainer.
 * Credit balance, package pricing, and the Pro Trainer plan below are
 * illustrative; needs the real credits/subscription endpoints rather than
 * fixed values, and both purchase actions need the Razorpay Checkout SDK
 * (not installed yet, same gap payment methods flags) to actually charge.
 */
const CREDITS_REMAINING = 12;

const PACKAGES: BidCreditPackage[] = [
  { key: '10-credits', credits: 10, perCreditLabel: '₹20', totalLabel: '₹199' },
  { key: '25-credits', credits: 25, perCreditLabel: '₹16', totalLabel: '₹399', highlight: 'Best value' },
  { key: '50-credits', credits: 50, perCreditLabel: '₹14', totalLabel: '₹699' },
];

const PRO_TRAINER_BENEFITS = [
  'Unlimited bids, no credits needed',
  'Priority placement in customer search',
  'Lower platform commission on packages',
];

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function TrainerBidCreditsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBuyPackage = (option: BidCreditPackage) => comingSoon(`Buying ${option.credits} credits`);
  const handleStartTrial = () => comingSoon('Starting your Pro Trainer trial');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Bid credits</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.summaryCard, { backgroundColor: colors.brand, borderRadius: Radius.card }]}>
          <Text variant="h6" color="onBrand" style={styles.eyebrow}>
            Credits remaining
          </Text>
          <Text variant="h1" color="onBrand" style={tabularNums}>
            {CREDITS_REMAINING} credits
          </Text>
          <Text variant="bodySecondary" color="onBrand" style={styles.summarySubtitle}>
            1 credit is used each time you place a bid
          </Text>
        </View>

        <Text variant="h5" style={styles.sectionTitle}>
          Buy more credits
        </Text>
        <View style={styles.packages}>
          {PACKAGES.map((option) => (
            <BidCreditPackageRow key={option.key} option={option} onPress={handleBuyPackage} />
          ))}
        </View>

        <Text variant="h5" style={styles.sectionTitle}>
          Or go unlimited
        </Text>
        <Card style={styles.proCard}>
          <Text variant="h5">Pro Trainer · ₹499/month</Text>
          <TrainerCertificationList certifications={PRO_TRAINER_BENEFITS} />
          <Button
            label="Start free trial"
            variant="secondary"
            size="large"
            fullWidth
            onPress={handleStartTrial}
            style={styles.trialButton}
          />
        </Card>
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
    paddingBottom: Spacing.s8,
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
  packages: {
    gap: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  proCard: {
    gap: Spacing.s4,
  },
  trialButton: {
    marginTop: Spacing.s1,
  },
});
