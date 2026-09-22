import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Avatar, BackButton, Button, CameraIcon, Input, Pill, Text } from '@/components/ui';
import { getMe, updateMe } from '@/lib/api/endpoints/me';
import { useSessionStore } from '@/store/useSessionStore';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Edit profile — Figma "Profile/Edit profile" screen. Wired to GET/PATCH
 * /me — full name, bio, and gender all round-trip to the backend. Gender
 * options mirror the backend enum (male/female/other/prefer_not_to_say)
 * rather than the Figma copy, since Save must send a value the API accepts.
 * Avatar upload has no image-hosting endpoint yet, so it stays comingSoon.
 */

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

const GENDER_OPTIONS: { key: Gender; label: string }[] = [
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
  { key: 'other', label: 'Other' },
  { key: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const { user, phone, setUser } = useSessionStore();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMe();
        if (cancelled) return;
        setFullName(me.fullName);
        setBio(me.bio ?? '');
        setGender((me.gender as Gender | undefined) ?? null);
      } catch {
        // fall back to the session's fullName already set above
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const trimmedName = fullName.trim();
  const canSave = trimmedName.length > 0 && !saving;

  const handleSave = useCallback(async () => {
    if (!user || !canSave) return;
    setSaving(true);
    setError(undefined);
    try {
      const updated = await updateMe({
        name: trimmedName,
        bio: bio.trim() || undefined,
        gender: gender ?? undefined,
      });
      setUser({ ...user, fullName: updated.fullName });
      router.back();
    } catch {
      setError('Could not save your changes. Try again.');
    } finally {
      setSaving(false);
    }
  }, [user, canSave, trimmedName, bio, gender, setUser]);

  const initials = useMemo(() => trimmedName || 'You', [trimmedName]);

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Edit profile</Text>
        </View>

        <View style={styles.avatarWrap}>
          <Avatar size="hero" initials={initials} seed={user?.id ?? phone ?? 'me'} />
          {/* <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            onPress={() => comingSoon('Changing your profile photo')}
            style={[styles.editBadge, { backgroundColor: colors.accent, borderColor: colors.background }]}>
            <CameraIcon size={13} color={colors.onAccent} />
          </Pressable> */}
        </View>

        {loadingProfile && (
          <ActivityIndicator color={colors.textMuted} style={styles.loadingIndicator} />
        )}

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            Full name
          </Text>
          <Input value={fullName} onChangeText={setFullName} placeholder="Your full name" hideLabel />
        </View>

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            Bio
          </Text>
          <Input
            value={bio}
            onChangeText={setBio}
            placeholder="Tell others about your fitness journey"
            multiline
            hideLabel
          />
        </View>

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            Gender
          </Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((option) => (
              <Pill
                key={option.key}
                label={option.label}
                selected={gender === option.key}
                onPress={() => setGender(option.key)}
              />
            ))}
          </View>
        </View>

        {error && (
          <Text variant="caption" color="danger" style={styles.error}>
            {error}
          </Text>
        )}

        <Button
          label="Save changes"
          size="large"
          fullWidth
          disabled={!canSave}
          loading={saving}
          onPress={handleSave}
          style={styles.saveButton}
        />
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
    paddingBottom: Spacing.s6,
  },
  avatarWrap: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: Spacing.s8,
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    marginBottom: Spacing.s6,
  },
  fieldLabel: {
    marginBottom: Spacing.s2,
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
  loadingIndicator: {
    marginBottom: Spacing.s4,
  },
  error: {
    textAlign: 'center',
    marginBottom: Spacing.s3,
  },
  saveButton: {
    marginTop: Spacing.s2,
  },
});
