import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Avatar, Button, Input, Pill, Text } from '@/components/ui';
import { completeProfile, type Gender } from '@/lib/api/endpoints/auth';
import { useSessionStore } from '@/store/useSessionStore';
import { Spacing } from '@/theme';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[1][0];
}

export default function AuthProfileSetupScreen() {
  const phone = useSessionStore((s) => s.phone);
  const user = useSessionStore((s) => s.user);
  const setUser = useSessionStore((s) => s.setUser);
  const setProfileCompleted = useSessionStore((s) => s.setProfileCompleted);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const canContinue = name.trim().length >= 2 && gender !== null;
  const initials = useMemo(() => initialsFor(name), [name]);

  const handleContinue = async () => {
    if (!gender || name.trim().length < 2 || !user) return;
    setLoading(true);
    setError(undefined);
    try {
      const updated = await completeProfile({ name: name.trim(), gender });
      setUser(updated);
      setProfileCompleted();
      router.replace('/');
    } catch {
      setError('Could not save your profile. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text variant="h1">Set up your profile</Text>
          <Text variant="body" color="textSecondary">
            Just the basics for now — you can add a photo and bio later.
          </Text>
        </View>

        <View style={styles.avatarRow}>
          <Avatar size="profile" initials={initials} seed={phone ?? 'new-user'} />
        </View>

        <View style={styles.form}>
          <Input label="Full name" placeholder="Your name" value={name} onChangeText={setName} autoFocus />

          <View>
            <Text variant="caption" color="textSecondary" style={styles.genderLabel}>
              Gender
            </Text>
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map((option) => (
                <Pill
                  key={option.value}
                  label={option.label}
                  selected={gender === option.value}
                  onPress={() => setGender(option.value)}
                />
              ))}
            </View>
          </View>
        </View>

        {error && (
          <Text variant="caption" color="danger" style={styles.error}>
            {error}
          </Text>
        )}

        <Button
          label="Continue"
          size="large"
          fullWidth
          loading={loading}
          disabled={!canContinue}
          onPress={handleContinue}
          style={styles.footer}
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
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s4,
  },
  header: {
    marginTop: Spacing.s8,
    marginBottom: Spacing.s6,
    gap: Spacing.s2,
  },
  avatarRow: {
    alignItems: 'center',
    marginBottom: Spacing.s6,
  },
  form: {
    gap: Spacing.s5,
  },
  genderLabel: {
    marginBottom: Spacing.s2,
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
  error: {
    marginTop: Spacing.s2,
  },
  footer: {
    marginTop: Spacing.s8,
  },
});
