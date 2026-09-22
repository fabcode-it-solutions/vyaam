import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { StarIcon } from './StarIcon';

export type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  max?: number;
};

/** Tappable star row for collecting a rating, e.g. Post-Session Review. `StarRating` stays display-only for this. */
export const StarRatingInput = memo(function StarRatingInput({ value, onChange, size = 32, max = 5 }: StarRatingInputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= value;
        return (
          <Pressable
            key={starValue}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${starValue} out of ${max} stars`}
            accessibilityState={{ selected: filled }}
            hitSlop={4}
            onPress={() => onChange(starValue)}>
            <StarIcon size={size} filled={filled} color={filled ? colors.accentDeep : colors.border} />
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
