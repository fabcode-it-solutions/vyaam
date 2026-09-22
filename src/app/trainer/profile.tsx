import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/Screen';
import {
  TrainerAvailabilityRow,
  TrainerCertificationList,
  TrainerPricingCard,
  TrainerProfileHeader,
  TrainerSpecialityList,
  type TrainerProfileSummary,
} from '@/components/trainer';
import { BackButton, Button, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Trainer Profile — full detail view opened from a Discover result. Trainer
 * fields below are illustrative (matches Figma node for Anjali Kaushik);
 * needs the real trainer-detail endpoint, keyed off the `id` route param,
 * rather than a static record.
 */

type TrainerProfileData = TrainerProfileSummary & {
  about: string;
  specialities: string[];
  certifications: string[];
  pricePerSession: number;
  packagePrice: number;
  packageSessions: number;
  availableDays: string[];
};

const MOCK_TRAINER: TrainerProfileData = {
  name: 'Anjali Kaushik',
  verified: true,
  specialty: 'Yoga & Mobility Coach',
  rating: 4.8,
  reviewCount: 63,
  distanceKm: 2.3,
  city: 'Hisar',
  modes: ['At home', 'Online'],
  about:
    "I've been teaching yoga for 6 years, focused on beginners recovering from desk-job back pain and stiffness. Sessions are slow, breath-led, and adapted to what your body can actually do that day — not a fixed routine.",
  specialities: ['Beginner yoga', 'Back pain recovery', 'Prenatal-safe', 'Breathwork', 'Flexibility'],
  certifications: ['RYT-200 Yoga Alliance', 'Certified Prenatal Yoga Instructor'],
  pricePerSession: 600,
  packagePrice: 2200,
  packageSessions: 4,
  availableDays: ['Tue', 'Wed', 'Fri', 'Sat'],
};

export default function TrainerProfileScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const trainer = MOCK_TRAINER;

  const handleMessage = useCallback(
    () => router.push({ pathname: '/chat/conversations-list', params: { name: trainer.name } }),
    [trainer.name],
  );
  const handleInvite = useCallback(
    () => router.push({ pathname: '/requests/invite-trainer', params: { id, name: trainer.name } }),
    [id, trainer.name],
  );
  const handleOpenReviews = useCallback(() => router.push('/trainer/reviews'), []);

  return (
    <Screen padded={false} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TrainerProfileHeader trainer={trainer} onPressReviews={handleOpenReviews} />

        <Section title="About">
          <Text variant="bodySecondary" color="textSecondary">
            {trainer.about}
          </Text>
        </Section>

        <Section title="Specialities">
          <TrainerSpecialityList specialities={trainer.specialities} />
        </Section>

        <Section title="Certifications">
          <TrainerCertificationList certifications={trainer.certifications} />
        </Section>

        <Section title="Pricing">
          <TrainerPricingCard
            pricePerSession={trainer.pricePerSession}
            packagePrice={trainer.packagePrice}
            packageSessions={trainer.packageSessions}
          />
        </Section>

        <Section title="Availability">
          <TrainerAvailabilityRow availableDays={trainer.availableDays} />
        </Section>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + Spacing.s4 },
        ]}>
        <Button label="Message" variant="secondary" onPress={handleMessage} />
        <View style={styles.inviteButton}>
          <Button label="Invite to my request" variant="primary" fullWidth onPress={handleInvite} />
        </View>
      </View>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="h4" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s2,
  },
  content: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s6,
  },
  section: {
    gap: Spacing.s3,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s4,
  },
  inviteButton: {
    flex: 1,
  },
});
