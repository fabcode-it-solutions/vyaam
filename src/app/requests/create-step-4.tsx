import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { BackButton, Button, Card, Input, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Create Request — Step 4 of 4 (review + post). Summary values below mirror
 * what steps 1–3 collected; needs real shared state (or a route param/store)
 * across the flow instead of each step's local `useState`, plus the actual
 * create-request endpoint behind Post request.
 */

const STEP_PROGRESS = 1;

const SUMMARY_ROWS: { label: string; value: string }[] = [
  { label: 'Goal', value: 'Upper body strength coaching' },
  { label: 'Mode', value: 'At home' },
  { label: 'Location', value: 'Sector 14, Hisar' },
  { label: 'Schedule', value: '4 days/week · Early morning' },
  { label: 'Gender', value: 'No preference' },
  { label: 'Language', value: 'English, Hindi' },
  { label: 'Budget', value: '₹400 – ₹800 / session' },
];

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function CreateRequestStep4Screen() {
  const { colors } = useTheme();
  const [notes, setNotes] = useState('');

  const handlePost = useCallback(() => comingSoon('Posting this request'), []);

  return (
    <Screen>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <Text variant="caption" color="textMuted">
          Step 4 of 4
        </Text>
      </View>

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">Review and post</Text>
        <Text variant="bodySecondary" color="textSecondary">
          Trainers in your area will be notified right away.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color="textSecondary" style={styles.label}>
          Anything else trainers should know? (optional)
        </Text>
        <Input
          hideLabel
          label="Additional notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. I have a mild knee issue, prefer low-impact exercises."
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text variant="h5" style={styles.label}>
          Your request
        </Text>
        <Card padded={false} style={styles.summaryCard}>
          {SUMMARY_ROWS.map((row, index) => (
            <View
              key={row.label}
              style={[styles.summaryRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Text variant="caption" color="textSecondary">
                {row.label}
              </Text>
              <Text variant="h5" style={styles.summaryValue} numberOfLines={2}>
                {row.value}
              </Text>
            </View>
          ))}
        </Card>
      </View>

      <Button label="Post request" size="large" fullWidth onPress={handlePost} style={styles.footer} />
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
  summaryCard: {
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.s4,
    paddingHorizontal: Spacing.s5,
    paddingVertical: Spacing.s4,
  },
  summaryValue: {
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: Spacing.s4,
  },
});
