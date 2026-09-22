import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Card, CheckIcon, CrownIcon, ReceiptIcon, Text } from '@/components/ui';
import { cancelSubscription, getSubscription, type Subscription } from '@/lib/api/endpoints/subscriptions';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Subscription — Figma "Profile/Subscription" screen. Plan, status, and
 * billing history are read from the real GET /me/subscription. Upgrade stays
 * comingSoon: pricing/plan IDs aren't finalized yet (CLAUDE.md), and the
 * upgrade endpoint needs a real Razorpay plan_id, so there's nothing safe to
 * send yet. Cancel is wired for real once a paid plan is active.
 */

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

const PLAN_LABEL: Record<Subscription['plan'], string> = {
  free: 'Free',
  premium: 'Premium',
  trainer_credits: 'Trainer Credits',
  trainer_pro: 'Trainer Pro',
};

const FREE_PLAN_FEATURES = [
  '3 AI plan regenerations / month',
  'Basic calculators & logging',
  '2 trainer bids per request',
];

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatAmount(amountPaise: number, currency: string) {
  return `${currency === 'INR' ? '₹' : currency + ' '}${(amountPaise / 100).toFixed(0)}`;
}

export default function SubscriptionScreen() {
  const { colors } = useTheme();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getSubscription();
        if (!cancelled) setSubscription(result);
      } catch {
        // falls back to the free-plan-looking empty state rendered below
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isPaidPlan = subscription ? subscription.plan !== 'free' && subscription.plan !== 'trainer_credits' : false;
  const canCancel = isPaidPlan && subscription?.status !== 'canceled' && !subscription?.cancelAtPeriodEnd;

  const handleCancel = async () => {
    if (!canCancel || cancelling) return;
    setCancelling(true);
    try {
      await cancelSubscription();
      setSubscription((prev) => (prev ? { ...prev, cancelAtPeriodEnd: true } : prev));
    } catch {
      Alert.alert('Something went wrong', 'Could not cancel your subscription. Try again.');
    } finally {
      setCancelling(false);
    }
  };

  const planLabel = subscription ? PLAN_LABEL[subscription.plan] : 'Free';
  const periodEndLabel = formatDate(subscription?.currentPeriodEnd ?? null);
  const billingHistory = subscription?.billingHistory ?? [];

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Subscription</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.textMuted} style={styles.loading} />
        ) : (
          <>
            <View style={[styles.planCard, { backgroundColor: colors.brand }]}>
              <Text variant="caption" color="onBrand" style={styles.planLabel}>
                CURRENT PLAN
              </Text>
              <Text variant="h1" color="onBrand" style={styles.planName}>
                {planLabel}
              </Text>
              {isPaidPlan ? (
                <>
                  {periodEndLabel && (
                    <Text variant="bodySecondary" color="onBrand">
                      {subscription?.cancelAtPeriodEnd
                        ? `Cancels on ${periodEndLabel}`
                        : `Renews on ${periodEndLabel}`}
                    </Text>
                  )}
                  {canCancel && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Cancel subscription"
                      onPress={handleCancel}
                      disabled={cancelling}
                      style={styles.cancelLink}>
                      <Text variant="bodySecondary" color="onBrand" style={styles.cancelLinkText}>
                        {cancelling ? 'Cancelling…' : 'Cancel subscription'}
                      </Text>
                    </Pressable>
                  )}
                </>
              ) : (
                <View style={styles.featureList}>
                  {FREE_PLAN_FEATURES.map((feature) => (
                    <View key={feature} style={styles.featureRow}>
                      <CheckIcon size={14} color={colors.onBrand} />
                      <Text variant="bodySecondary" color="onBrand">
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {!isPaidPlan && (
              <Card style={styles.upgradeCard}>
                <View style={styles.upgradeHeader}>
                  <View style={[styles.crownCircle, { backgroundColor: colors.accentTint }]}>
                    <CrownIcon size={20} color={colors.accentDeep} />
                  </View>
                  <View style={styles.upgradeText}>
                    <Text variant="h5">Upgrade to Premium</Text>
                    <Text variant="caption" color="textSecondary">
                      Unlimited AI plans, priority trainer
                    </Text>
                  </View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Upgrade to Premium"
                  onPress={() => comingSoon('Upgrading to Premium')}
                  style={[styles.upgradeButton, { backgroundColor: colors.brand }]}>
                  <Text variant="h4" color="onBrand">
                    Upgrade
                  </Text>
                </Pressable>
              </Card>
            )}

            <Text variant="h4" style={styles.sectionLabel}>
              Billing history
            </Text>

            {billingHistory.length === 0 ? (
              <Card style={styles.emptyCard}>
                <View style={[styles.emptyIcon, { backgroundColor: colors.border }]}>
                  <ReceiptIcon size={20} color={colors.textMuted} />
                </View>
                <Text variant="caption" color="textMuted" style={styles.emptyText}>
                  No invoices yet.
                </Text>
              </Card>
            ) : (
              <Card padded={false} style={styles.billingCard}>
                {billingHistory.map((invoice, index) => (
                  <View
                    key={invoice.id}
                    style={[styles.billingRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
                    <View style={styles.billingText}>
                      <Text variant="h5">{formatAmount(invoice.amount, invoice.currency)}</Text>
                      <Text variant="caption" color="textMuted">
                        {formatDate(invoice.issuedAt) ?? invoice.status}
                      </Text>
                    </View>
                    <Text variant="caption" color="textSecondary">
                      {invoice.status}
                    </Text>
                  </View>
                ))}
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.s6,
    paddingBottom: Spacing.s8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  loading: {
    marginTop: Spacing.s8,
  },
  planCard: {
    borderRadius: Radius.card,
    padding: Spacing.s5,
    marginBottom: Spacing.s5,
  },
  planLabel: {
    letterSpacing: 1,
    opacity: 0.7,
  },
  planName: {
    marginTop: Spacing.s1,
    marginBottom: Spacing.s4,
  },
  featureList: {
    gap: Spacing.s2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
  cancelLink: {
    marginTop: Spacing.s3,
    alignSelf: 'flex-start',
  },
  cancelLinkText: {
    textDecorationLine: 'underline',
  },
  upgradeCard: {
    gap: Spacing.s4,
    marginBottom: Spacing.s6,
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  crownCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeText: {
    flex: 1,
    gap: 2,
  },
  upgradeButton: {
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    marginBottom: Spacing.s3,
  },
  emptyCard: {
    alignItems: 'center',
    gap: Spacing.s3,
    paddingVertical: Spacing.s8,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  billingCard: {
    overflow: 'hidden',
  },
  billingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
  billingText: {
    gap: 2,
  },
});
