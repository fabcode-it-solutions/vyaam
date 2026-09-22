import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Card, Pill, Text } from '@/components/ui';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { PainBodyMap, type BodyPoint } from '@/components/intake/PainBodyMap';
import { PainDetailCard } from '@/components/intake/PainDetailCard';
import { PainSummaryRow } from '@/components/intake/PainSummaryRow';
import type { PainArea } from '@/components/intake/PainArea';
import type { BodyPart, PainPoint } from '@/lib/api/endpoints/workoutPlan';
import { useIntakeStore } from '@/store/useIntakeStore';
import { Spacing } from '@/theme';

const KNOWN_BODY_PARTS = new Set<BodyPart>([
  'neck',
  'shoulder',
  'elbow',
  'wrist',
  'chest',
  'upper_back',
  'lower_back',
  'hip',
  'knee',
  'ankle',
  'other',
]);

/** The body map has a "foot" point the backend's bodyPart enum has no slot for — falls back to "other". */
function toBackendBodyPart(id: string): BodyPart {
  return (KNOWN_BODY_PARTS.has(id as BodyPart) ? id : 'other') as BodyPart;
}

function toBackendPainPoints(areas: PainArea[]): PainPoint[] {
  return areas.map((area) => ({
    bodyPart: toBackendBodyPart(area.id),
    timing: area.timing,
    severity: area.severity,
    diagnosedStatus: area.diagnosis === 'seeing_physio' ? 'seeing_a_physio' : area.diagnosis,
  }));
}

// 3 of 5 — see Intake/Training Location for the step count this is measured against.
const STEP_PROGRESS = 3 / 5;

/**
 * Intake/Pain Screen — Figma node 113:346
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=113-346).
 */
export default function IntakePainScreen() {
  const draftPainPoints = useIntakeStore((s) => s.workout.painPoints);
  const setWorkoutAnswers = useIntakeStore((s) => s.setWorkoutAnswers);

  const [areas, setAreas] = useState<PainArea[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noneSelected, setNoneSelected] = useState(!draftPainPoints || draftPainPoints.length === 0);

  const selectedIds = useMemo(() => new Set(areas.map((a) => a.id)), [areas]);
  const otherSelected = selectedIds.has('other');

  const togglePoint = useCallback((point: BodyPoint) => {
    setNoneSelected(false);
    setAreas((prev) => {
      if (prev.some((a) => a.id === point.id)) {
        setExpandedId((current) => (current === point.id ? null : current));
        return prev.filter((a) => a.id !== point.id);
      }
      setExpandedId(point.id);
      return [
        ...prev,
        { id: point.id, label: point.label, timing: 'after_activity', severity: 5, diagnosis: 'not_diagnosed' },
      ];
    });
  }, []);

  const toggleOther = useCallback(() => {
    togglePoint({ id: 'other', label: 'Other', x: 0, y: 0 });
  }, [togglePoint]);

  const selectNone = useCallback(() => {
    setNoneSelected(true);
    setExpandedId(null);
    setAreas([]);
  }, []);

  const updateArea = useCallback((updated: PainArea) => {
    setAreas((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }, []);

  const removeArea = useCallback((id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    setExpandedId((current) => (current === id ? null : current));
  }, []);

  const expandArea = useCallback((id: string) => setExpandedId(id), []);

  const handleContinue = () => {
    setWorkoutAnswers({ painPoints: toBackendPainPoints(areas) });
    router.push('/intake/experience-level');
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton onPress={() => router.back()} style={styles.backButton} />

        <IntakeProgressBar progress={STEP_PROGRESS} />

        <View style={styles.header}>
          <Text variant="h2">Any pain or injuries?</Text>
          <Text variant="bodySecondary" color="textSecondary">
            Tap any areas that bother you during training — we’ll build around them.
          </Text>
        </View>

        <Card style={styles.mapCard}>
          <PainBodyMap selectedIds={selectedIds} onTogglePoint={togglePoint} />
        </Card>

        <View style={styles.pills}>
          <Pill label="None" selected={noneSelected} onPress={selectNone} />
          <Pill label="Other" selected={otherSelected} onPress={toggleOther} />
        </View>

        {areas.length > 0 && (
          <>
            <Text variant="h5" style={styles.sectionTitle}>
              Selected areas ({areas.length})
            </Text>
            <View style={styles.areas}>
              {areas.map((area) =>
                area.id === expandedId ? (
                  <PainDetailCard key={area.id} area={area} onChange={updateArea} onRemove={removeArea} />
                ) : (
                  <PainSummaryRow key={area.id} area={area} onPress={expandArea} onRemove={removeArea} />
                ),
              )}
            </View>
          </>
        )}

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
  scrollContent: {
    paddingHorizontal: Spacing.s6,
    paddingBottom: Spacing.s8,
  },
  backButton: {
    marginTop: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  header: {
    gap: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  mapCard: {
    paddingVertical: Spacing.s5,
  },
  pills: {
    flexDirection: 'row',
    gap: Spacing.s2,
    marginTop: Spacing.s6,
    marginBottom: Spacing.s6,
  },
  sectionTitle: {
    marginBottom: Spacing.s3,
  },
  areas: {
    gap: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  footer: {
    marginTop: Spacing.s2,
  },
});
