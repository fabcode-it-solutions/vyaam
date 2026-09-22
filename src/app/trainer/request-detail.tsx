import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { RequestFieldRow } from '@/components/trainer';
import { BackButton, Button, Card, Text, UserIcon } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Trainer/Request Detail — a lead opened from leads-list/leads-map. Fields
 * and notes below are illustrative (matches Figma's "Upper body strength
 * coaching" example); needs the real lead-detail endpoint, keyed off the
 * `id` route param, rather than static data. Customer identity is
 * masked (first name + last initial, no photo) until a bid is accepted,
 * matching the marketplace's contact-masking rules elsewhere in the app.
 */
const CUSTOMER_NAME = 'Priya S.';
const POSTED_LABEL = 'Posted 2 days ago · 5 bids so far';

const FIELDS: { label: string; value: string }[] = [
  { label: 'Goal', value: 'Upper body strength coaching' },
  { label: 'Mode', value: 'At home' },
  { label: 'Location', value: 'Sector 14, Hisar' },
  { label: 'Schedule', value: '4 days/week · Early morning' },
  { label: 'Start date', value: 'As soon as possible' },
  { label: 'Gender preference', value: 'No preference' },
  { label: 'Language', value: 'English, Hindi' },
  { label: 'Budget', value: '₹400 – ₹800' },
];

const CUSTOMER_NOTES = "I have a mild knee issue, prefer low-impact exercises where possible.";

export default function TrainerRequestDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const goalField = FIELDS.find((field) => field.label === 'Goal');
  const budgetField = FIELDS.find((field) => field.label === 'Budget');

  const handlePlaceBid = () => {
    router.push({
      pathname: '/trainer/place-bid',
      params: { id, title: goalField?.value, budgetRange: budgetField?.value },
    });
  };

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Request details</Text>
        </View>

        <Card style={styles.customerCard}>
          <View style={[styles.avatar, { backgroundColor: colors.border }]}>
            <UserIcon size={22} color={colors.textMuted} />
          </View>
          <View style={styles.customerText}>
            <Text variant="h5">{CUSTOMER_NAME}</Text>
            <Text variant="caption" color="textMuted">
              {POSTED_LABEL}
            </Text>
          </View>
        </Card>

        <Card padded={false} style={styles.fieldsCard}>
          <View style={styles.fieldsInner}>
            {FIELDS.map((field, index) => (
              <RequestFieldRow key={field.label} label={field.label} value={field.value} isFirst={index === 0} />
            ))}
          </View>
        </Card>

        <View style={styles.notesSection}>
          <Text variant="h5">Notes from customer</Text>
          <Text variant="bodySecondary" color="textSecondary">
            {CUSTOMER_NOTES}
          </Text>
        </View>

        <Button label="Place a bid" size="large" fullWidth onPress={handlePlaceBid} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    marginBottom: Spacing.s5,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerText: {
    flex: 1,
    gap: 2,
  },
  fieldsCard: {
    marginBottom: Spacing.s6,
  },
  fieldsInner: {
    paddingHorizontal: Spacing.s4,
  },
  notesSection: {
    gap: Spacing.s2,
    marginBottom: Spacing.s8,
  },
});
