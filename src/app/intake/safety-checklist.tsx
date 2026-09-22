import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Card, Switch, Text } from '@/components/ui';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import type { SafetyFlag } from '@/lib/api/endpoints/dietPlan';
import { useIntakeStore } from '@/store/useIntakeStore';
import { Radius, Spacing, useTheme } from '@/theme';

const ITEMS: { flag: SafetyFlag; label: string }[] = [
  { flag: 'pregnant_postpartum', label: 'Pregnant or postpartum' },
  { flag: 'heart_condition_or_high_bp', label: 'Heart condition or high BP' },
  { flag: 'diabetes', label: 'Diabetes' },
  { flag: 'thyroid_condition', label: 'Thyroid condition' },
  { flag: 'pcos_pcod', label: 'PCOS or PCOD' },
  { flag: 'kidney_or_liver_condition', label: 'Kidney or liver condition' },
  { flag: 'recent_surgery', label: 'Recent surgery (6 months)' },
  { flag: 'on_regular_medication', label: 'On regular medication' },
  { flag: 'under_doctors_care', label: 'Under a doctor’s care' },
];

// 3 of 6 — see Intake/Goal for the step count this is measured against.
const STEP_PROGRESS = 3 / 6;

/**
 * Intake/Safety Checklist — Figma node 64:76
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=64-76).
 */
export default function IntakeSafetyChecklistScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const draft = useIntakeStore((s) => s.diet);
  const setDietAnswers = useIntakeStore((s) => s.setDietAnswers);

  const [checked, setChecked] = useState<Set<SafetyFlag>>(new Set(draft.safetyFlags ?? []));
  const [surgeryDetail, setSurgeryDetail] = useState(draft.surgeryDetails ?? '');

  const toggle = (flag: SafetyFlag) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) {
        next.delete(flag);
      } else {
        next.add(flag);
      }
      return next;
    });
  };

  const hasSurgery = checked.has('recent_surgery');

  const handleContinue = () => {
    setDietAnswers({
      safetyFlags: Array.from(checked),
      surgeryDetails: hasSurgery && surgeryDetail.trim() ? surgeryDetail.trim() : undefined,
    });
    router.push('/intake/diet-type');
  };

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => router.back()} style={styles.backButton} />

        <IntakeProgressBar progress={STEP_PROGRESS} />

        <View style={styles.header}>
          <Text variant="h2">A few health questions</Text>
          <Text variant="bodySecondary" color="textSecondary">
            So we can keep your plan safe. Be honest — nobody else sees this.
          </Text>
        </View>

        <Card style={styles.checklist} padded={false}>
          {ITEMS.map((item, index) => (
            <View key={item.flag}>
              <View style={styles.row}>
                <Text variant="h5" style={styles.rowLabel}>
                  {item.label}
                </Text>
                <Switch
                  value={checked.has(item.flag)}
                  onValueChange={() => toggle(item.flag)}
                  accessibilityLabel={item.label}
                />
              </View>

              {item.flag === 'recent_surgery' && hasSurgery && (
                <View style={styles.surgeryFieldWrap}>
                  <TextInput
                    value={surgeryDetail}
                    onChangeText={setSurgeryDetail}
                    placeholder="Tell us what surgery, so trainers know to go gently"
                    placeholderTextColor={colors.textMuted}
                    style={[
                      theme.typography.caption,
                      styles.surgeryField,
                      { backgroundColor: colors.background, color: colors.textPrimary },
                    ]}
                  />
                </View>
              )}

              {index < ITEMS.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </Card>

        <Button
          label="Continue"
          size="large"
          fullWidth
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
  backButton: {
    marginTop: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  header: {
    gap: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  checklist: {
    paddingHorizontal: Spacing.s4,
  },
  row: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.s4,
  },
  rowLabel: {
    flex: 1,
  },
  divider: {
    height: 1,
  },
  surgeryFieldWrap: {
    paddingBottom: Spacing.s4,
  },
  surgeryField: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.s3,
    paddingVertical: Spacing.s3,
  },
  footer: {
    marginTop: Spacing.s8,
    marginBottom: Spacing.s4,
  },
});
