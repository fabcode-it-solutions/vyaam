import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { SectionLabel, SettingsSectionCard, type SettingsRowConfig } from '@/components/settings';
import { Badge, BackButton, KeyIcon, LinkIcon, LockIcon, MailIcon, PhoneIcon, Switch, Text } from '@/components/ui';
import { getAccountSettings, setTwoFactor, type AccountSettings } from '@/lib/api/endpoints/me';
import { useSessionStore } from '@/store/useSessionStore';
import { Spacing } from '@/theme';

/**
 * Account settings — Figma "Profile/Account settings" screen. Phone, email,
 * two-factor state, and connected accounts are all read from GET
 * /me/account-settings; the two-factor switch writes back through PATCH
 * /me/two-factor. Changing phone/email/password each need a re-verification
 * flow (Firebase re-auth for phone, nothing designed yet for email/password)
 * that doesn't exist as a screen yet, so those rows stay comingSoon.
 */

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

/** "+919876543210" -> "+91 98765 43210" — cosmetic grouping only, doesn't validate the number. */
function formatIndianPhone(raw: string) {
  const match = raw.match(/^\+91(\d{5})(\d{5})$/);
  if (!match) return raw;
  return `+91 ${match[1]} ${match[2]}`;
}

export default function AccountSettingsScreen() {
  const sessionPhone = useSessionStore((s) => s.phone);
  const [settings, setSettings] = useState<AccountSettings | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [savingTwoFactor, setSavingTwoFactor] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getAccountSettings();
        if (cancelled) return;
        setSettings(result);
        setTwoFactorEnabled(result.twoFactorEnabled);
      } catch {
        // fall back to session-derived phone / defaults rendered below
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleTwoFactor = useCallback(
    async (value: boolean) => {
      const previous = twoFactorEnabled;
      setTwoFactorEnabled(value);
      setSavingTwoFactor(true);
      try {
        await setTwoFactor(value);
      } catch {
        setTwoFactorEnabled(previous);
        Alert.alert('Something went wrong', 'Could not update two-factor authentication. Try again.');
      } finally {
        setSavingTwoFactor(false);
      }
    },
    [twoFactorEnabled],
  );

  const phoneLabel = settings?.phone
    ? formatIndianPhone(settings.phone)
    : sessionPhone
      ? formatIndianPhone(sessionPhone)
      : 'Not added';
  const emailLabel = settings?.email ?? 'Not added';

  const securityRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'phone',
        icon: PhoneIcon,
        label: 'Phone number',
        trailingText: phoneLabel,
        onPress: () => comingSoon('Changing your phone number'),
      },
      {
        key: 'email',
        icon: MailIcon,
        label: 'Email address',
        trailingText: emailLabel,
        onPress: () => comingSoon('Changing your email address'),
      },
      {
        key: 'password',
        icon: LockIcon,
        label: 'Change password',
        onPress: () => comingSoon('Changing your password'),
      },
      {
        key: 'two-factor',
        icon: KeyIcon,
        label: 'Two-factor authentication',
        trailing: (
          <Switch
            value={twoFactorEnabled}
            onValueChange={handleToggleTwoFactor}
            disabled={savingTwoFactor}
            accessibilityLabel="Two-factor authentication"
          />
        ),
      },
    ],
    [phoneLabel, emailLabel, twoFactorEnabled, savingTwoFactor, handleToggleTwoFactor],
  );

  const connectedRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'google',
        icon: LinkIcon,
        label: 'Google account',
        trailing: settings?.connectedAccounts.google ? (
          <Badge label="Connected" variant="verified" />
        ) : undefined,
        trailingText: settings?.connectedAccounts.google ? undefined : 'Not connected',
        onPress: () => comingSoon('Managing your Google account'),
      },
      {
        key: 'apple',
        icon: LinkIcon,
        label: 'Apple account',
        trailing: settings?.connectedAccounts.apple ? (
          <Badge label="Connected" variant="verified" />
        ) : undefined,
        trailingText: settings?.connectedAccounts.apple ? undefined : 'Not connected',
        onPress: () => comingSoon('Managing your Apple account'),
      },
    ],
    [settings],
  );

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Account settings</Text>
        </View>

        <SectionLabel label="Login & security" />
        <SettingsSectionCard rows={securityRows} />

        <SectionLabel label="Connected accounts" />
        <SettingsSectionCard rows={connectedRows} />
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
