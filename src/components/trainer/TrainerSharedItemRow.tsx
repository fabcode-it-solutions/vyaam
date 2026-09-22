import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, ChevronIcon, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

export type TrainerSharedItem = {
  id: string;
  title: string;
  subtitle: string;
};

export type TrainerSharedItemRowProps = {
  item: TrainerSharedItem;
  onPress: (item: TrainerSharedItem) => void;
};

/** One row in Client Detail's "Shared with you" list (weight log, progress photos, workout logs). */
export const TrainerSharedItemRow = memo(function TrainerSharedItemRow({ item, onPress }: TrainerSharedItemRowProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(item), [onPress, item]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={item.title} onPress={handlePress}>
      <Card style={styles.card}>
        <View style={styles.body}>
          <Text variant="h5">{item.title}</Text>
          <Text variant="caption" color="textMuted">
            {item.subtitle}
          </Text>
        </View>
        <ChevronIcon size={16} color={colors.textMuted} />
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  body: {
    flex: 1,
    gap: 2,
  },
});
