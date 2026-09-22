import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { SectionLabel, SettingsSectionCard, type SettingsRowConfig } from '@/components/settings';
import { BackButton, BellIcon, CardIcon, HomeIcon, LocationPinIcon, Switch, Text } from '@/components/ui';
import { Spacing } from '@/theme';

/**
 * Trainer/Leads "Saved search" — the match-criteria and notification prefs
 * behind the leads-list "Saved search" pill. No saved-search endpoint
 * exists yet, so criteria are read-only display values and the two
 * notification switches are local state only.
 */
function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function TrainerSavedSearchSettingsScreen() {
  const [notifyInstantly, setNotifyInstantly] = useState(true);
  const [activeHoursOnly, setActiveHoursOnly] = useState(false);

  const handleEditCriterion = useCallback((label: string) => comingSoon(`Changing ${label.toLowerCase()}`), []);

  const criteriaRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'training-mode',
        icon: HomeIcon,
        label: 'Training mode',
        trailingText: 'At home, Gym',
        onPress: () => handleEditCriterion('Training mode'),
      },
      {
        key: 'distance-radius',
        icon: LocationPinIcon,
        label: 'Distance radius',
        trailingText: '5 km',
        onPress: () => handleEditCriterion('Distance radius'),
      },
      {
        key: 'budget-range',
        icon: CardIcon,
        label: 'Budget range',
        trailingText: '₹300–900',
        onPress: () => handleEditCriterion('Budget range'),
      },
    ],
    [handleEditCriterion],
  );

  const notificationRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'notify-instantly',
        icon: BellIcon,
        label: 'Notify me instantly',
        trailing: (
          <Switch value={notifyInstantly} onValueChange={setNotifyInstantly} accessibilityLabel="Notify me instantly" />
        ),
      },
      {
        key: 'active-hours-only',
        icon: BellIcon,
        label: 'Only during active hours',
        trailing: (
          <Switch
            value={activeHoursOnly}
            onValueChange={setActiveHoursOnly}
            accessibilityLabel="Only during active hours"
          />
        ),
      },
    ],
    [notifyInstantly, activeHoursOnly],
  );

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Saved search</Text>
        </View>

        <SectionLabel label="Match criteria" />
        <SettingsSectionCard rows={criteriaRows} />

        <SectionLabel label="Notifications" />
        <SettingsSectionCard rows={notificationRows} />
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
});
