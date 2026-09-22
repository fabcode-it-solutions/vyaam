import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { SectionLabel, SettingsSectionCard, type SettingsRowConfig } from '@/components/settings';
import {
  BackButton,
  BanIcon,
  DocumentIcon,
  EyeIcon,
  ImageIcon,
  OptionSheet,
  Switch,
  Text,
  UsersIcon,
} from '@/components/ui';
import {
  getPrivacySettings,
  updatePrivacySettings,
  type PrivacySettings,
  type VisibilityLevel,
} from '@/lib/api/endpoints/me';
import { Spacing } from '@/theme';

/**
 * Privacy settings — Figma "Profile/Privacy" screen. Visibility values (who
 * can see the profile / progress photos / logs) are read from GET
 * /me/privacy-settings and written back through PATCH /me/privacy-settings
 * via a bottom-sheet picker (everyone / trainers only / only me).
 * "Show on leaderboards" writes back the same way. Blocked users opens a
 * real list backed by GET/DELETE /me/blocked-users.
 */

type VisibilityField = 'profileVisibility' | 'progressPhotosVisibility' | 'logsVisibility';

const VISIBILITY_LABEL: Record<VisibilityLevel, string> = {
  everyone: 'Everyone',
  trainers: 'Trainers only',
  private: 'Only me',
};

const VISIBILITY_OPTIONS = (Object.keys(VISIBILITY_LABEL) as VisibilityLevel[]).map((value) => ({
  value,
  label: VISIBILITY_LABEL[value],
}));

const DEFAULTS: PrivacySettings = {
  profileVisibility: 'everyone',
  progressPhotosVisibility: 'private',
  logsVisibility: 'trainers',
  showOnLeaderboards: true,
};

export default function PrivacySettingsScreen() {
  const [settings, setSettings] = useState<PrivacySettings>(DEFAULTS);
  const [savingLeaderboards, setSavingLeaderboards] = useState(false);
  const [editingField, setEditingField] = useState<VisibilityField | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getPrivacySettings();
        if (!cancelled) setSettings(result);
      } catch {
        // keep the defaults rendered above
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleLeaderboards = useCallback(
    async (value: boolean) => {
      const previous = settings;
      setSettings((prev) => ({ ...prev, showOnLeaderboards: value }));
      setSavingLeaderboards(true);
      try {
        const result = await updatePrivacySettings({ showOnLeaderboards: value });
        setSettings(result);
      } catch {
        setSettings(previous);
        Alert.alert('Something went wrong', 'Could not update this preference. Try again.');
      } finally {
        setSavingLeaderboards(false);
      }
    },
    [settings],
  );

  const handleChangeVisibility = useCallback(
    async (field: VisibilityField, value: string) => {
      const nextValue = value as VisibilityLevel;
      const previous = settings;
      setSettings((prev) => ({ ...prev, [field]: nextValue }));
      try {
        const result = await updatePrivacySettings({ [field]: nextValue });
        setSettings(result);
      } catch {
        setSettings(previous);
        Alert.alert('Something went wrong', 'Could not update this preference. Try again.');
      }
    },
    [settings],
  );

  const visibilityRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'profile-visibility',
        icon: EyeIcon,
        label: 'Profile visibility',
        trailingText: VISIBILITY_LABEL[settings.profileVisibility],
        onPress: () => setEditingField('profileVisibility'),
      },
      {
        key: 'progress-photos',
        icon: ImageIcon,
        label: 'Progress photos',
        trailingText: VISIBILITY_LABEL[settings.progressPhotosVisibility],
        onPress: () => setEditingField('progressPhotosVisibility'),
      },
      {
        key: 'workout-diet-logs',
        icon: DocumentIcon,
        label: 'Workout & diet logs',
        trailingText: VISIBILITY_LABEL[settings.logsVisibility],
        onPress: () => setEditingField('logsVisibility'),
      },
    ],
    [settings],
  );

  const otherRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'leaderboards',
        icon: UsersIcon,
        label: 'Show on leaderboards',
        trailing: (
          <Switch
            value={settings.showOnLeaderboards}
            onValueChange={handleToggleLeaderboards}
            disabled={savingLeaderboards}
            accessibilityLabel="Show on leaderboards"
          />
        ),
      },
      {
        key: 'blocked-users',
        icon: BanIcon,
        label: 'Blocked users',
        onPress: () => router.push('/profile/blockedusers'),
      },
    ],
    [settings.showOnLeaderboards, savingLeaderboards, handleToggleLeaderboards],
  );

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Privacy</Text>
        </View>

        <SectionLabel label="Who can see" />
        <SettingsSectionCard rows={visibilityRows} />

        <SectionLabel label="Other" />
        <SettingsSectionCard rows={otherRows} />
      </ScrollView>

      <OptionSheet
        visible={editingField !== null}
        value={editingField ? settings[editingField] : 'everyone'}
        options={VISIBILITY_OPTIONS}
        onChange={(value) => {
          if (editingField) handleChangeVisibility(editingField, value);
        }}
        onRequestClose={() => setEditingField(null)}
      />
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
