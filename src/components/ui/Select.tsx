import { memo, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';

import { ChevronIcon } from './ChevronIcon';
import { OptionSheet } from './OptionSheet';
import { Text } from './Text';

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  label?: string;
  /** Hide the label visually while keeping it for screen readers. */
  hideLabel?: boolean;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
};

/**
 * Tap-through field that opens a bottom-sheet list of options — the
 * dropdown/picker used e.g. for the exercise choice on the 1RM calculator.
 * One component for this job, rather than each screen hand-rolling its own
 * Modal + list, per the same "build one reusable component" rule as
 * Button/Input/Pill in CLAUDE.md.
 */
export const Select = memo(function Select({
  label,
  hideLabel = false,
  value,
  options,
  onChange,
  placeholder = 'Select',
}: SelectProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <View>
      {label && (
        <Text
          variant="caption"
          color="textSecondary"
          style={hideLabel ? styles.srOnly : styles.label}
          accessibilityElementsHidden={false}>
          {label}
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        onPress={handleOpen}
        style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text
          variant="body"
          color={selected ? 'textPrimary' : 'textMuted'}
          numberOfLines={1}
          style={styles.valueText}>
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronIcon direction="down" size={16} color={colors.textMuted} />
      </Pressable>

      <OptionSheet visible={open} value={value} options={options} onChange={onChange} onRequestClose={handleClose} />
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    marginBottom: Spacing.s2,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.s4,
  },
  valueText: {
    flex: 1,
    marginRight: Spacing.s2,
  },
});
