import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Input, Text, WarningTriangleIcon } from '@/components/ui';
import { requestAccountDeletion } from '@/lib/api/endpoints/me';
import { useSessionStore } from '@/store/useSessionStore';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Delete account — Figma "Profile/Delete account" screen. Wired to the real
 * POST /me/delete, which starts a 30-day grace period rather than purging
 * immediately (the backend has no cron job to actually purge data yet, but
 * that's a server-side concern — the client just needs to reflect what the
 * endpoint promises). The user is logged out locally right after, same as
 * the regular log-out flow.
 */

const REMOVED_ITEMS = [
  'Your profile, logs, and progress photos',
  'AI-generated diet and workout plans',
  'Chat history with trainers',
  'Any active session bookings',
];

const CONFIRM_WORD = 'DELETE';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DeleteAccountScreen() {
  const { colors } = useTheme();
  const logout = useSessionStore((s) => s.logout);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const canDelete = confirmText.trim().toUpperCase() === CONFIRM_WORD && !deleting;

  const handleDelete = useCallback(async () => {
    if (!canDelete) return;
    setDeleting(true);
    setError(undefined);
    try {
      const result = await requestAccountDeletion();
      Alert.alert(
        'Account deletion scheduled',
        `Your account will be permanently deleted on ${formatDate(result.purgeScheduledFor)}. Log back in before then to cancel.`,
        [
          {
            text: 'OK',
            onPress: () => {
              logout();
              router.replace('/');
            },
          },
        ],
      );
    } catch {
      setError('Could not delete your account. Try again.');
      setDeleting(false);
    }
  }, [canDelete, logout]);

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Delete account</Text>
        </View>

        <View style={[styles.warningCircle, { backgroundColor: colors.dangerTint }]}>
          <WarningTriangleIcon size={28} color={colors.danger} />
        </View>

        <Text variant="h3" style={styles.title}>
          This can’t be undone
        </Text>
        <Text variant="bodySecondary" color="textSecondary" style={styles.subtitle}>
          Deleting your account permanently removes the following:
        </Text>

        <View style={[styles.itemsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {REMOVED_ITEMS.map((item) => (
            <View key={item} style={styles.itemRow}>
              <View style={[styles.bullet, { backgroundColor: colors.textSecondary }]} />
              <Text variant="bodySecondary" color="textSecondary" style={styles.itemText}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        <Text variant="caption" color="textSecondary" style={styles.confirmLabel}>
          Type {CONFIRM_WORD} to confirm
        </Text>
        <Input
          hideLabel
          label={`Type ${CONFIRM_WORD} to confirm`}
          value={confirmText}
          onChangeText={setConfirmText}
          placeholder={CONFIRM_WORD}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        {error && (
          <Text variant="caption" color="danger" style={styles.error}>
            {error}
          </Text>
        )}

        <Button
          label="Permanently delete my account"
          variant="destructive"
          size="large"
          fullWidth
          disabled={!canDelete}
          loading={deleting}
          onPress={handleDelete}
          style={styles.deleteButton}
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
    paddingBottom: Spacing.s5,
  },
  warningCircle: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s5,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  itemsCard: {
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.s5,
    gap: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.s2,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    marginTop: 9,
  },
  itemText: {
    flex: 1,
  },
  confirmLabel: {
    marginBottom: Spacing.s2,
  },
  error: {
    textAlign: 'center',
    marginTop: Spacing.s4,
  },
  deleteButton: {
    marginTop: Spacing.s6,
  },
});
