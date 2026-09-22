import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { SettingsSectionCard, type SettingsRowConfig } from '@/components/settings';
import { BackButton, BookIcon, DocumentIcon, InfoIcon, ShieldIcon, Text } from '@/components/ui';
import { Spacing } from '@/theme';

/**
 * About & legal — Figma "Profile/About & legal" screen. Reachable at
 * /profile/about-legal (the Figma label uses an "&" which isn't a valid
 * route segment, so the file/route is kebab-cased like its sibling settings
 * screens). The legal documents themselves aren't hosted anywhere yet, so
 * each row opens a comingSoon() alert; app version reads from the real
 * Expo config rather than a hardcoded string.
 */

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function AboutLegalScreen() {
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const legalRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'terms',
        icon: DocumentIcon,
        label: 'Terms of Service',
        onPress: () => comingSoon('Terms of Service'),
      },
      {
        key: 'privacy-policy',
        icon: ShieldIcon,
        label: 'Privacy Policy',
        onPress: () => comingSoon('The Privacy Policy'),
      },
      {
        key: 'community-guidelines',
        icon: BookIcon,
        label: 'Community Guidelines',
        onPress: () => comingSoon('Community Guidelines'),
      },
      {
        key: 'licenses',
        icon: DocumentIcon,
        label: 'Open source licenses',
        onPress: () => comingSoon('Open source licenses'),
      },
    ],
    [],
  );

  const versionRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'version',
        icon: InfoIcon,
        label: 'App version',
        trailingText: `v${appVersion}`,
      },
    ],
    [appVersion],
  );

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">About & legal</Text>
        </View>

        <SettingsSectionCard rows={legalRows} />

        <View style={styles.standaloneCard}>
          <SettingsSectionCard rows={versionRows} />
        </View>
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
  standaloneCard: {
    marginTop: Spacing.s6,
  },
});
