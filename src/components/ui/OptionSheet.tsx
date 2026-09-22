import { memo, useCallback } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, Spacing, useTheme } from '@/theme';

import { CheckIcon } from './CheckIcon';
import { Text } from './Text';

export type OptionSheetOption = {
  value: string;
  label: string;
};

export type OptionSheetProps = {
  visible: boolean;
  value: string;
  options: OptionSheetOption[];
  onChange: (value: string) => void;
  onRequestClose: () => void;
};

/**
 * Bottom-sheet single-select list — the Modal + FlatList body used by
 * `Select`, extracted so it can also be driven from an externally-controlled
 * trigger (e.g. a SettingsRow) instead of Select's own field-style Pressable.
 */
export const OptionSheet = memo(function OptionSheet({
  visible,
  value,
  options,
  onChange,
  onRequestClose,
}: OptionSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleSelect = useCallback(
    (nextValue: string) => {
      onChange(nextValue);
      onRequestClose();
    },
    [onChange, onRequestClose],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<OptionSheetOption>) => {
      const isSelected = item.value === value;
      return (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.label}
          accessibilityState={{ selected: isSelected }}
          onPress={() => handleSelect(item.value)}
          style={styles.optionRow}>
          <Text variant="h5" numberOfLines={1} style={styles.optionLabel}>
            {item.label}
          </Text>
          {isSelected && (
            <View style={[styles.checkCircle, { backgroundColor: colors.brand }]}>
              <CheckIcon size={11} color={colors.onBrand} />
            </View>
          )}
        </Pressable>
      );
    },
    [colors, handleSelect, value],
  );

  const keyExtractor = useCallback((item: OptionSheetOption) => item.value, []);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        style={styles.backdrop}
        onPress={onRequestClose}
      />
      <View
        style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + Spacing.s4 }]}>
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
        />
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
    maxHeight: '70%',
    paddingTop: Spacing.s3,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.s3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.s5,
    paddingVertical: Spacing.s4,
  },
  optionLabel: {
    flex: 1,
    marginRight: Spacing.s3,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    marginHorizontal: Spacing.s5,
  },
});
