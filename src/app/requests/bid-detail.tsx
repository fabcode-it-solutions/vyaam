import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Card, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

/**
 * Requests/Bid Detail — full view of one trainer's bid, opened from Request
 * Detail or Bid Comparison. Trainer summary, pitch, and availability-match
 * copy below are illustrative (matches Figma's Anjali Kaushik bid); needs
 * the real bid-detail endpoint, keyed off the `id` route param.
 */

type BidDetailData = {
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  price: number;
  pitch: string;
  availabilityMatch: string;
};

const BID_DETAILS: Record<string, BidDetailData> = {
  'bid-1': {
    name: 'Anjali Kaushik',
    specialty: 'Yoga & Mobility Coach',
    rating: 4.8,
    reviewCount: 63,
    price: 600,
    pitch:
      'I focus on beginner-friendly strength and mobility work, especially for people recovering from desk-job stiffness. I can adapt around any joint concerns you mention, and sessions are slow-paced to start — we build up together. Available early mornings, which fits your schedule well.',
    availabilityMatch: 'Free Mon, Wed, Fri, Sat early mornings — matches your requested schedule.',
  },
  'bid-2': {
    name: 'Rohit Sharma',
    specialty: 'Strength Coach',
    rating: 4.9,
    reviewCount: 108,
    price: 750,
    pitch:
      'Certified strength coach with 6 years of experience training clients at home in Hisar. I run a structured 8-session progression so you can track strength gains week over week, not just "feel tired" after a session.',
    availabilityMatch: 'Free Tue, Thu, Sat early mornings — matches your requested schedule.',
  },
  'bid-3': {
    name: 'Karan Mehta',
    specialty: 'Gym Trainer',
    rating: 4.6,
    reviewCount: 29,
    price: 500,
    pitch:
      'Flexible timing and can start this week. I keep sessions simple — compound lifts, steady progression, no gimmicks — and I’m happy to work around whatever equipment you have at home.',
    availabilityMatch: 'Flexible across the week, including early mornings — matches your requested schedule.',
  },
  'bid-4': {
    name: 'Meera Iyer',
    specialty: 'Strength & Conditioning Coach',
    rating: 4.7,
    reviewCount: 41,
    price: 650,
    pitch:
      'Certified strength and conditioning coach with flexible morning slots. I build sessions around your current strength level rather than a fixed template, so week one looks different from week four.',
    availabilityMatch: 'Free Mon, Wed, Fri early mornings — matches your requested schedule.',
  },
  'bid-5': {
    name: 'Vikram Singh',
    specialty: 'Strength Coach',
    rating: 4.5,
    reviewCount: 17,
    price: 800,
    pitch:
      'I specialise in progressive overload programs for beginners — a clear plan for adding weight or reps each week, so progress is easy to see and stays safe on your joints.',
    availabilityMatch: 'Free Wed, Fri, Sat early mornings — matches your requested schedule.',
  },
};

export default function BidDetailScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const bid = (id && BID_DETAILS[id]) || BID_DETAILS['bid-1'];
  const firstName = bid.name.split(' ')[0];

  const handleMessage = useCallback(
    () => router.push({ pathname: '/chat/conversations-list', params: { name: bid.name } }),
    [bid.name],
  );
  const handleAccept = useCallback(
    () => router.push({ pathname: '/requests/accept-bid-confirmation', params: { id } }),
    [id],
  );

  return (
    <Screen padded={false} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Bid from {firstName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.trainerCard}>
          <View style={[styles.avatar, { backgroundColor: colors.border }]} />
          <View style={styles.trainerInfo}>
            <Text variant="h5" numberOfLines={1}>
              {bid.name}
            </Text>
            <Text variant="caption" color="textSecondary" numberOfLines={1} style={tabularNums}>
              {bid.specialty} · {bid.rating.toFixed(1)} ({bid.reviewCount})
            </Text>
          </View>
        </Card>

        <View style={[styles.priceCard, { backgroundColor: colors.brand }]}>
          <Text variant="caption" color="onBrand" style={styles.priceLabel}>
            BID PRICE
          </Text>
          <Text variant="h1" color="onBrand" style={tabularNums}>
            ₹{bid.price} / session
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="h4">Trainer’s pitch</Text>
          <Text variant="bodySecondary" color="textSecondary">
            {bid.pitch}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="h4">Availability match</Text>
          <Text variant="bodySecondary" color="textSecondary">
            {bid.availabilityMatch}
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + Spacing.s4 },
        ]}>
        <Button label="Message" variant="secondary" onPress={handleMessage} />
        <View style={styles.acceptButton}>
          <Button label="Accept this bid" variant="primary" fullWidth onPress={handleAccept} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s4,
  },
  content: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s5,
  },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
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
  priceCard: {
    borderRadius: Radius.card,
    padding: Spacing.s5,
    gap: Spacing.s2,
  },
  priceLabel: {
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  section: {
    gap: Spacing.s3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s4,
  },
  acceptButton: {
    flex: 1,
  },
});
