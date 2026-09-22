import { memo } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';

import { Button, type ButtonVariant } from './Button';
import { Text } from './Text';

export type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Centered confirm/cancel dialog for destructive or otherwise irreversible
 * actions (log out, delete, discard) — reused rather than one-off Alert
 * calls so the styling matches the rest of the app instead of the OS default.
 */
export const ConfirmModal = memo(function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'destructive',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close" style={styles.backdrop} onPress={onCancel} />
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text variant="h3" style={styles.title}>
            {title}
          </Text>
          {message && (
            <Text variant="bodySecondary" color="textSecondary" style={styles.message}>
              {message}
            </Text>
          )}
          <View style={styles.actions}>
            <Button label={cancelLabel} variant="secondary" onPress={onCancel} disabled={loading} style={styles.actionButton} />
            <Button
              label={confirmLabel}
              variant={confirmVariant}
              onPress={onConfirm}
              loading={loading}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.s6,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.s5,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: Spacing.s2,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.s3,
    marginTop: Spacing.s5,
  },
  actionButton: {
    flex: 1,
  },
});
