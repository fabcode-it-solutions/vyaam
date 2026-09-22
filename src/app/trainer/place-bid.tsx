import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BidPackageOption, type BidPackage } from '@/components/trainer';
import { BackButton, Button, Card, CheckIcon, Input, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Trainer/Place a bid — opened from Request Detail's "Place a bid" button.
 * Request title/budget come through as route params with the Figma example
 * as a fallback; package discount tiers are illustrative (needs the real
 * pricing-rules endpoint rather than fixed 1/12 and 1/6 discount fractions),
 * and "their requested days" is hardcoded rather than read from the request.
 */
const DISCOUNT_TIERS: { key: string; sessions: number; discount: number }[] = [
  { key: 'single', sessions: 1, discount: 0 },
  { key: 'package-4', sessions: 4, discount: 1 / 12 },
  { key: 'package-8', sessions: 8, discount: 1 / 6 },
];

const REQUESTED_DAYS = ['Monday', 'Wednesday', 'Friday', 'Saturday'];
const DEFAULT_AVAILABLE_DAYS = ['Monday', 'Wednesday', 'Friday'];

function formatRupees(n: number) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function packagesFor(pricePerSession: number): BidPackage[] {
  return DISCOUNT_TIERS.map(({ key, sessions, discount }) => {
    const fullTotal = sessions * pricePerSession;
    if (sessions === 1) {
      return { key, title: 'Single session', subtitle: `${formatRupees(pricePerSession)} per session, no commitment` };
    }
    const save = Math.round(fullTotal * discount);
    const total = fullTotal - save;
    return {
      key,
      title: `${sessions}-session package`,
      subtitle: `${formatRupees(total)} total · Save ${formatRupees(save)}`,
    };
  });
}

export default function TrainerPlaceBidScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ id?: string; title?: string; budgetRange?: string }>();

  const requestTitle = params.title || 'Upper body strength coaching';
  const budgetRange = params.budgetRange || '₹400–800';

  const [pricePerSession, setPricePerSession] = useState('600');
  const [selectedPackage, setSelectedPackage] = useState('package-4');
  const [availableDays, setAvailableDays] = useState<string[]>(DEFAULT_AVAILABLE_DAYS);
  const [pitch, setPitch] = useState(
    'I focus on beginner-friendly strength work — happy to adapt around your knee.',
  );

  const packages = useMemo(() => packagesFor(Number(pricePerSession) || 0), [pricePerSession]);

  const toggleDay = (day: string) => {
    setAvailableDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleSubmit = () => {
    Alert.alert('Coming soon', 'Submitting a bid isn’t wired up yet.');
  };

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Place your bid</Text>
        </View>

        <Text variant="bodySecondary" color="textSecondary" style={styles.subtitle}>
          For "{requestTitle}" · Budget {budgetRange}
        </Text>

        <View style={styles.field}>
          <Input
            label="Your price per session (₹)"
            value={pricePerSession}
            onChangeText={setPricePerSession}
            placeholder="600"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            Package
          </Text>
          <View style={styles.packages}>
            {packages.map((option) => (
              <BidPackageOption
                key={option.key}
                option={option}
                selected={selectedPackage === option.key}
                onSelect={setSelectedPackage}
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            Confirm your availability for their requested days
          </Text>
          <Card padded={false} style={styles.daysCard}>
            {REQUESTED_DAYS.map((day, index) => {
              const checked = availableDays.includes(day);
              return (
                <Pressable
                  key={day}
                  accessibilityRole="checkbox"
                  accessibilityLabel={day}
                  accessibilityState={{ checked }}
                  onPress={() => toggleDay(day)}
                  style={[styles.dayRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: checked ? colors.brand : colors.background,
                        borderColor: checked ? colors.brand : colors.border,
                      },
                    ]}>
                    {checked && <CheckIcon size={12} color={colors.onBrand} />}
                  </View>
                  <Text variant="h5">{day}</Text>
                </Pressable>
              );
            })}
          </Card>
        </View>

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            Your pitch to the customer
          </Text>
          <Input
            hideLabel
            label="Your pitch to the customer"
            value={pitch}
            onChangeText={setPitch}
            placeholder="Tell them why you're a good fit"
            multiline
          />
        </View>

        <Button label="Submit bid" size="large" fullWidth onPress={handleSubmit} style={styles.submitButton} />
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
    paddingBottom: Spacing.s2,
  },
  subtitle: {
    marginBottom: Spacing.s5,
  },
  field: {
    marginBottom: Spacing.s5,
  },
  fieldLabel: {
    marginBottom: Spacing.s2,
  },
  packages: {
    gap: Spacing.s3,
  },
  daysCard: {
    overflow: 'hidden',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    marginTop: Spacing.s3,
  },
});
