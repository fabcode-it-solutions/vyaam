import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { DocumentIcon, Text, XIcon } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type CertificationFileCardProps = {
  fileName: string;
  onRemove?: () => void;
};

/** One uploaded certificate row on Trainer/Verification "Certifications". */
export const CertificationFileCard = memo(function CertificationFileCard({
  fileName,
  onRemove,
}: CertificationFileCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.verifiedTint }]}>
      <DocumentIcon size={18} color={colors.verified} />
      <Text variant="h5" numberOfLines={1} style={styles.fileName}>
        {fileName}
      </Text>
      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${fileName}`}
          hitSlop={8}
          onPress={onRemove}>
          <XIcon size={16} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
  fileName: {
    flex: 1,
  },
});
