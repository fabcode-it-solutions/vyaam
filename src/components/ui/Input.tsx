import { memo, useCallback, useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';

import { Text } from './Text';

export type InputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  /** Hide the label visually while keeping it for screen readers. */
  hideLabel?: boolean;
  error?: string;
  /** e.g. a search/location glyph rendered at the field's leading edge. */
  leadingIcon?: ReactNode;
  /** e.g. "kg", "cm" rendered at the field's trailing edge. */
  trailingUnit?: string;
  /** Textarea: 16px corner radius instead of a pill, per the Brand Guide. */
  multiline?: boolean;
};

/**
 * The text field used throughout every form (Brand Guide section 07 Form
 * fields). Label sits above the field, never as a floating placeholder — a
 * floating placeholder disappears exactly when the user needs it most.
 *
 * Per the guide's field rules: validate on blur, not on every keystroke, and
 * phrase error copy as what to do ("Enter an age between 13 and 100"), not
 * what went wrong ("Invalid input").
 */
export const Input = memo(function Input({
  label,
  hideLabel = false,
  error,
  leadingIcon,
  trailingUnit,
  multiline = false,
  onFocus,
  onBlur,
  editable = true,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const { colors } = theme;
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
    (e) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );
  const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
    (e) => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const borderColor = error ? colors.danger : focused ? colors.brand : colors.border;

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
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.surface,
            borderColor,
            borderRadius: multiline ? Radius.media : Radius.full,
            borderWidth: focused ? 1.5 : 1,
            opacity: editable ? 1 : 0.6,
          },
          multiline && styles.multilineField,
        ]}>
        {leadingIcon && <View style={styles.leadingIcon}>{leadingIcon}</View>}
        <TextInput
          style={[
            theme.typography.body,
            styles.input,
            { color: colors.textPrimary },
            multiline && styles.multilineInput,
          ]}
          placeholderTextColor={colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...rest}
        />
        {trailingUnit && (
          <Text variant="body" color="textMuted" style={styles.trailingUnit}>
            {trailingUnit}
          </Text>
        )}
      </View>
      {error && (
        <Text variant="caption" color="danger" style={styles.helper}>
          {error}
        </Text>
      )}
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
    minHeight: 48,
    paddingHorizontal: Spacing.s4,
  },
  multilineField: {
    alignItems: 'flex-start',
    minHeight: 96,
    paddingVertical: Spacing.s3,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 72,
  },
  leadingIcon: {
    marginRight: Spacing.s2,
  },
  trailingUnit: {
    marginLeft: Spacing.s2,
  },
  helper: {
    marginTop: Spacing.s2,
  },
});
