import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { SearchIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type HomeSearchBarProps = {
  placeholder: string;
  onPress: () => void;
};

/** Tap-through search field — opens Discover rather than editing inline on Home. */
export const HomeSearchBar = memo(function HomeSearchBar({ placeholder, onPress }: HomeSearchBarProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={placeholder}
      onPress={onPress}
      style={[
        styles.field,
        { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: Radius.full },
      ]}>
      <SearchIcon size={20} color={colors.textMuted} />
      <Text variant="body" color="textMuted" numberOfLines={1} style={styles.placeholder}>
        {placeholder}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.s4,
    borderWidth: 1,
  },
  placeholder: {
    marginLeft: Spacing.s2,
    flexShrink: 1,
  },
});
