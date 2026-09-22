import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text, XIcon } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

import {
  DIAGNOSIS_LABEL,
  TIMING_LABEL,
  type PainArea,
  type PainDiagnosis,
  type PainTiming,
} from './PainArea';
import { SegmentedChoice } from './SegmentedChoice';
import { SeveritySlider } from './SeveritySlider';

const TIMING_OPTIONS = (Object.keys(TIMING_LABEL) as PainTiming[]).map((value) => ({
  value,
  label: TIMING_LABEL[value],
}));
const DIAGNOSIS_OPTIONS = (Object.keys(DIAGNOSIS_LABEL) as PainDiagnosis[]).map((value) => ({
  value,
  label: DIAGNOSIS_LABEL[value],
}));

export type PainDetailCardProps = {
  area: PainArea;
  onChange: (area: PainArea) => void;
  onRemove: (id: string) => void;
};

/** Expanded editor for one selected pain area (Figma node 113:376). */
export const PainDetailCard = memo(function PainDetailCard({ area, onChange, onRemove }: PainDetailCardProps) {
  const { colors } = useTheme();

  const handleRemove = useCallback(() => onRemove(area.id), [onRemove, area.id]);
  const handleTiming = useCallback((timing: PainTiming) => onChange({ ...area, timing }), [onChange, area]);
  const handleSeverity = useCallback((severity: number) => onChange({ ...area, severity }), [onChange, area]);
  const handleDiagnosis = useCallback(
    (diagnosis: PainDiagnosis) => onChange({ ...area, diagnosis }),
    [onChange, area],
  );

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: Radius.card }]}>
      <View style={styles.headerRow}>
        <Text variant="h5">{area.label}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${area.label}`} hitSlop={8} onPress={handleRemove}>
          <XIcon color={colors.textMuted} />
        </Pressable>
      </View>

      <Text variant="caption" color="textMuted" style={styles.fieldLabel}>
        When does it hurt?
      </Text>
      <SegmentedChoice options={TIMING_OPTIONS} value={area.timing} onChange={handleTiming} />

      <Text variant="caption" color="textMuted" style={styles.fieldLabel}>
        Severity · {area.severity}/10
      </Text>
      <SeveritySlider value={area.severity} onChange={handleSeverity} />

      <Text variant="caption" color="textMuted" style={[styles.fieldLabel, styles.diagnosedLabel]}>
        Diagnosed?
      </Text>
      <SegmentedChoice options={DIAGNOSIS_OPTIONS} value={area.diagnosis} onChange={handleDiagnosis} />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: Spacing.s4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.s4,
  },
  fieldLabel: {
    marginBottom: Spacing.s2,
  },
  diagnosedLabel: {
    marginTop: Spacing.s4,
  },
});
