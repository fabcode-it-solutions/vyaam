import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type InstructionStepsProps = {
  steps: string[];
};

/** Numbered "How to make it" step cards on Meal Detail (Figma node 152:531). */
export const InstructionSteps = memo(function InstructionSteps({ steps }: InstructionStepsProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.list}>
      {steps.map((step, index) => (
        <View key={step} style={[styles.card, { backgroundColor: colors.surface, borderRadius: Radius.card }]}>
          <View style={[styles.number, { backgroundColor: colors.border }]}>
            <Text variant="caption" style={tabularNums}>
              {index + 1}
            </Text>
          </View>
          <Text variant="bodySecondary" color="textSecondary" style={styles.label}>
            {step}
          </Text>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  list: {
    gap: Spacing.s3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.s4,
    gap: Spacing.s3,
  },
  number: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
});
