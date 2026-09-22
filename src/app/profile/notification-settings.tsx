import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { SectionLabel, SettingsSectionCard, type SettingsRowConfig } from '@/components/settings';
import { BackButton, BellIcon, CalendarIcon, ChatBubbleIcon, MegaphoneIcon, Switch, Text, UsersIcon } from '@/components/ui';
import {
  getNotificationSettings,
  updateNotificationSettings,
  type NotificationSettings,
} from '@/lib/api/endpoints/me';
import { Spacing } from '@/theme';

/**
 * Notification settings — Figma "Profile/Notification settings" screen.
 * Wired to GET/PATCH /me/notification-settings; each switch writes back
 * immediately (optimistic, reverted on failure) rather than batching into a
 * single Save, since that's the pattern the backend's partial-PATCH shape
 * naturally supports.
 */

const DEFAULTS: NotificationSettings = {
  pushEnabled: true,
  bidsAndMessages: true,
  sessionReminders: true,
  communityActivity: false,
  offersAndPromotions: false,
};

export default function NotificationSettingsScreen() {
  const [prefs, setPrefs] = useState<NotificationSettings>(DEFAULTS);
  const [savingKey, setSavingKey] = useState<keyof NotificationSettings | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getNotificationSettings();
        if (!cancelled) setPrefs(result);
      } catch {
        // keep the defaults rendered above
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const togglePref = useCallback(
    async (key: keyof NotificationSettings, value: boolean) => {
      const previous = prefs;
      setPrefs((prev) => ({ ...prev, [key]: value }));
      setSavingKey(key);
      try {
        const result = await updateNotificationSettings({ [key]: value });
        setPrefs(result);
      } catch {
        setPrefs(previous);
        Alert.alert('Something went wrong', 'Could not update this preference. Try again.');
      } finally {
        setSavingKey(null);
      }
    },
    [prefs],
  );

  const pushRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'push',
        icon: BellIcon,
        label: 'Push notifications',
        trailing: (
          <Switch
            value={prefs.pushEnabled}
            onValueChange={(value) => togglePref('pushEnabled', value)}
            disabled={savingKey === 'pushEnabled'}
            accessibilityLabel="Push notifications"
          />
        ),
      },
    ],
    [prefs.pushEnabled, savingKey, togglePref],
  );

  const notifyRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'bidsAndMessages',
        icon: ChatBubbleIcon,
        label: 'Bids & messages',
        trailing: (
          <Switch
            value={prefs.bidsAndMessages}
            onValueChange={(value) => togglePref('bidsAndMessages', value)}
            disabled={savingKey === 'bidsAndMessages'}
            accessibilityLabel="Bids & messages"
          />
        ),
      },
      {
        key: 'sessionReminders',
        icon: CalendarIcon,
        label: 'Session reminders',
        trailing: (
          <Switch
            value={prefs.sessionReminders}
            onValueChange={(value) => togglePref('sessionReminders', value)}
            disabled={savingKey === 'sessionReminders'}
            accessibilityLabel="Session reminders"
          />
        ),
      },
      {
        key: 'communityActivity',
        icon: UsersIcon,
        label: 'Community activity',
        trailing: (
          <Switch
            value={prefs.communityActivity}
            onValueChange={(value) => togglePref('communityActivity', value)}
            disabled={savingKey === 'communityActivity'}
            accessibilityLabel="Community activity"
          />
        ),
      },
      {
        key: 'offersAndPromotions',
        icon: MegaphoneIcon,
        label: 'Offers & promotions',
        trailing: (
          <Switch
            value={prefs.offersAndPromotions}
            onValueChange={(value) => togglePref('offersAndPromotions', value)}
            disabled={savingKey === 'offersAndPromotions'}
            accessibilityLabel="Offers & promotions"
          />
        ),
      },
    ],
    [prefs, savingKey, togglePref],
  );

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Notifications</Text>
        </View>

        <SectionLabel label="Push notifications" />
        <SettingsSectionCard rows={pushRows} />

        <SectionLabel label="Notify me about" />
        <SettingsSectionCard rows={notifyRows} />
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
