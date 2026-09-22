import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Input, PaperclipIcon, Pill, Text } from '@/components/ui';
import { createSupportTicket, type SupportTicketCategory } from '@/lib/api/endpoints/support';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Report an issue — Figma "Profile/Report an issue" screen. Submit is wired
 * to the real POST /support/tickets. Attaching a screenshot needs an
 * image-upload endpoint that doesn't exist yet, so that stays comingSoon —
 * the ticket can still be submitted without one (attachmentUrl is optional).
 */

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

type Category = 'bug' | 'payment' | 'trainer-conduct' | 'other';

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'bug', label: 'Bug' },
  { key: 'payment', label: 'Payment' },
  { key: 'trainer-conduct', label: 'Trainer conduct' },
  { key: 'other', label: 'Other' },
];

const CATEGORY_TO_API: Record<Category, SupportTicketCategory> = {
  bug: 'bug',
  payment: 'payment',
  'trainer-conduct': 'trainer_conduct',
  other: 'other',
};

export default function ReportIssueScreen() {
  const { colors } = useTheme();
  const [category, setCategory] = useState<Category>('bug');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const canSubmit = description.trim().length > 0 && !submitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(undefined);
    try {
      await createSupportTicket({ category: CATEGORY_TO_API[category], description: description.trim() });
      Alert.alert('Report submitted', 'Thanks — we read every report and will follow up if needed.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      setError('Could not submit your report. Try again.');
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, category, description]);

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Report an issue</Text>
        </View>

        <Text variant="bodySecondary" color="textSecondary" style={styles.intro}>
          Tell us what went wrong — we read every report.
        </Text>

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            Category
          </Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((option) => (
              <Pill
                key={option.key}
                label={option.label}
                selected={category === option.key}
                onPress={() => setCategory(option.key)}
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            What happened?
          </Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the issue in as much detail as you can…"
            multiline
            hideLabel
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Attach a screenshot"
          onPress={() => comingSoon('Attaching a screenshot')}
          style={[styles.attachButton, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <PaperclipIcon size={16} color={colors.textPrimary} />
          <Text variant="h5">Attach a screenshot</Text>
        </Pressable>

        {error && (
          <Text variant="caption" color="danger" style={styles.error}>
            {error}
          </Text>
        )}

        <Button
          label="Submit report"
          size="large"
          fullWidth
          disabled={!canSubmit}
          loading={submitting}
          onPress={handleSubmit}
          style={styles.submitButton}
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
  intro: {
    marginBottom: Spacing.s6,
  },
  field: {
    marginBottom: Spacing.s6,
  },
  fieldLabel: {
    marginBottom: Spacing.s3,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
  attachButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: Spacing.s2,
    height: 44,
    paddingHorizontal: Spacing.s4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  error: {
    textAlign: 'center',
    marginBottom: Spacing.s3,
  },
  submitButton: {
    marginTop: Spacing.s8,
  },
});
