import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { Text } from '@/components/ui';
import { Spacing } from '@/theme';

export type SectionLabelProps = {
  label: string;
};

/** Small uppercase heading above a settings card, e.g. "LOGIN & SECURITY". */
export const SectionLabel = memo(function SectionLabel({ label }: SectionLabelProps) {
  return (
    <Text variant="h6" color="textMuted" style={styles.label}>
      {label}
    </Text>
  );
});

const styles = StyleSheet.create({
  label: {
    marginTop: Spacing.s5,
    marginBottom: Spacing.s2,
  },
});
