import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Badge, BackButton, Card, CardIcon, ChevronIcon, PlusIcon, Text } from '@/components/ui';
import {
  listPaymentMethods,
  removePaymentMethod,
  setDefaultPaymentMethod,
  type PaymentMethod,
} from '@/lib/api/endpoints/payments';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Payment methods — Figma "Profile/Payment methods" screen. Listing,
 * set-default, and remove are wired to the real Razorpay-backed
 * /me/payment-methods endpoints. Adding a card needs the Razorpay Checkout
 * SDK (to turn card details into a gatewayToken without them touching our
 * server) which isn't installed in the app yet, so that action stays
 * comingSoon until that native integration is added.
 */

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function PaymentMethodsScreen() {
  const { colors } = useTheme();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await listPaymentMethods();
        if (!cancelled) setMethods(result);
      } catch {
        if (!cancelled) Alert.alert('Something went wrong', 'Could not load your payment methods. Try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleManage = useCallback((method: PaymentMethod) => {
    const options: { text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void }[] = [];
    if (!method.isDefault) {
      options.push({
        text: 'Set as default',
        onPress: async () => {
          setBusyId(method.id);
          try {
            await setDefaultPaymentMethod(method.id);
            setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === method.id })));
          } catch {
            Alert.alert('Something went wrong', 'Could not set this card as default. Try again.');
          } finally {
            setBusyId(null);
          }
        },
      });
    }
    options.push({
      text: 'Remove card',
      style: 'destructive',
      onPress: async () => {
        setBusyId(method.id);
        try {
          await removePaymentMethod(method.id);
          setMethods((prev) => prev.filter((m) => m.id !== method.id));
        } catch {
          Alert.alert('Something went wrong', 'Could not remove this card. Try again.');
        } finally {
          setBusyId(null);
        }
      },
    });
    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(`Card ending in ${method.cardLast4}`, undefined, options);
  }, []);

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Payment methods</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.textMuted} style={styles.loading} />
        ) : methods.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.border }]}>
              <CardIcon size={20} color={colors.textMuted} />
            </View>
            <Text variant="caption" color="textMuted" style={styles.emptyText}>
              No saved payment methods yet.
            </Text>
          </Card>
        ) : (
          <Card padded={false} style={styles.cardsCard}>
            {methods.map((card, index) => (
              <Pressable
                key={card.id}
                accessibilityRole="button"
                accessibilityLabel={`Card ending in ${card.cardLast4}`}
                onPress={() => handleManage(card)}
                disabled={busyId === card.id}
                style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
                <View style={[styles.rowIcon, { backgroundColor: colors.border }]}>
                  <CardIcon size={18} color={colors.textPrimary} />
                </View>
                <View style={styles.rowText}>
                  <Text variant="h5">
                    {card.cardBrand ? `${card.cardBrand} · ` : ''}Card ending in {card.cardLast4}
                  </Text>
                  {card.cardExpiryMonth && card.cardExpiryYear ? (
                    <Text variant="caption" color="textMuted">
                      Expires {String(card.cardExpiryMonth).padStart(2, '0')}/{String(card.cardExpiryYear).slice(-2)}
                    </Text>
                  ) : null}
                </View>
                {busyId === card.id ? (
                  <ActivityIndicator color={colors.textMuted} />
                ) : card.isDefault ? (
                  <Badge label="Default" variant="verified" />
                ) : (
                  <ChevronIcon size={16} color={colors.textMuted} />
                )}
              </Pressable>
            ))}
          </Card>
        )}

        <Card padded={false} style={styles.addCard}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add payment method"
            onPress={() => comingSoon('Adding a payment method')}
            style={styles.addRow}>
            <View style={[styles.rowIcon, { backgroundColor: colors.border }]}>
              <PlusIcon size={14} color={colors.textPrimary} />
            </View>
            <Text variant="h5">Add payment method</Text>
          </Pressable>
        </Card>
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
  cardsCard: {
    overflow: 'hidden',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  addCard: {
    overflow: 'hidden',
    marginTop: Spacing.s5,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
});
