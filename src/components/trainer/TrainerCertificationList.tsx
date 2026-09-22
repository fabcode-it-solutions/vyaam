import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type TrainerCertificationListProps = {
  certifications: string[];
};

/** Trainer Profile's "Certifications" checklist. */
export const TrainerCertificationList = memo(function TrainerCertificationList({
  certifications,
}: TrainerCertificationListProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.list}>
      {certifications.map((certification) => (
        <View key={certification} style={styles.row}>
          <View style={[styles.checkDot, { backgroundColor: colors.verifiedTint, borderRadius: Radius.full }]}>
            <CheckIcon size={11} color={colors.verified} />
          </View>
          <Text variant="bodySecondary" style={styles.label}>
            {certification}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  checkDot: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
});
