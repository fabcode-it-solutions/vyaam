import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type IngredientListProps = {
  ingredients: string[];
};

/** Bulleted ingredient card on Meal Detail (Figma node 152:517). */
export const IngredientList = memo(function IngredientList({ ingredients }: IngredientListProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: Radius.card }]}>
      {ingredients.map((ingredient) => (
        <View key={ingredient} style={styles.row}>
          <View style={[styles.bullet, { backgroundColor: colors.textMuted }]} />
          <Text variant="bodySecondary" color="textSecondary" style={styles.label}>
            {ingredient}
          </Text>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.s2,
    marginBottom: Spacing.s4,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 8,
  },
  label: {
    flex: 1,
  },
});
