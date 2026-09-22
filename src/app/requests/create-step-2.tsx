import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { BackButton, Button, LocationPinIcon, Pill, Select, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

/** Create Request — Step 2 of 4 (location, availability, and start date). */

const DAYS_PER_WEEK = [2, 3, 4, 5, 6];

const TIME_OPTIONS = ['Early morning', 'Morning', 'Afternoon', 'Evening'];

const START_DATE_OPTIONS = [
  { value: 'asap', label: 'As soon as possible' },
  { value: 'within_week', label: 'Within a week' },
  { value: 'within_month', label: 'Within a month' },
  { value: 'flexible', label: "I'm flexible" },
];

const STEP_PROGRESS = 0.5;

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function CreateRequestStep2Screen() {
  const { colors } = useTheme();
  const [location] = useState('Sector 14, Hisar, Haryana');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [preferredTime, setPreferredTime] = useState('Early morning');
  const [startDate, setStartDate] = useState('asap');

  const handleChangeLocation = useCallback(() => comingSoon('Changing location'), []);
  const handleContinue = useCallback(() => router.push('/requests/create-step-3'), []);

  return (
    <Screen>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <Text variant="caption" color="textMuted">
          Step 2 of 4
        </Text>
      </View>

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">Where and when?</Text>
        <Text variant="bodySecondary" color="textSecondary">
          Trainers nearby who fit your schedule will see this first.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color="textSecondary" style={styles.label}>
          Location
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Change location, currently ${location}`}
          onPress={handleChangeLocation}
          style={[styles.locationField, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <LocationPinIcon size={18} color={colors.textMuted} />
          <Text variant="body" numberOfLines={1} style={styles.locationText}>
            {location}
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color="textSecondary" style={styles.label}>
          Days per week
        </Text>
        <View style={styles.dayRow}>
          {DAYS_PER_WEEK.map((day) => {
            const selected = day === daysPerWeek;
            return (
              <Pressable
                key={day}
                accessibilityRole="radio"
                accessibilityLabel={`${day} days per week`}
                accessibilityState={{ checked: selected }}
                onPress={() => setDaysPerWeek(day)}
                style={[
                  styles.dayCircle,
                  {
                    backgroundColor: selected ? colors.brand : colors.surface,
                    borderColor: colors.border,
                    borderWidth: selected ? 0 : 1,
                  },
                ]}>
                <Text variant="h5" color={selected ? 'onBrand' : 'textPrimary'} style={tabularNums}>
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color="textSecondary" style={styles.label}>
          Preferred time
        </Text>
        <View style={styles.pillWrap}>
          {TIME_OPTIONS.map((option) => (
            <Pill key={option} label={option} selected={preferredTime === option} onPress={() => setPreferredTime(option)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color="textSecondary" style={styles.label}>
          Preferred start date
        </Text>
        <Select hideLabel label="Preferred start date" value={startDate} options={START_DATE_OPTIONS} onChange={setStartDate} />
      </View>

      <Button label="Continue" size="large" fullWidth onPress={handleContinue} style={styles.footer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.s2,
    marginBottom: Spacing.s4,
  },
  header: {
    gap: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  section: {
    marginBottom: Spacing.s6,
  },
  label: {
    marginBottom: Spacing.s3,
  },
  locationField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.s4,
  },
  locationText: {
    flex: 1,
  },
  dayRow: {
    flexDirection: 'row',
    gap: Spacing.s3,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: Spacing.s4,
  },
});
