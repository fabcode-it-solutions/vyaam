import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { CertificationFileCard } from '@/components/trainer';
import { BackButton, Button, PlusIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Trainer/Verification "Certifications" — optional step after upload-id.
 * Picking is real (expo-document-picker, images or PDF) and held in local
 * state only, same as upload-id.tsx — there's no upload pipeline on the
 * backend yet, so nothing here leaves the device.
 */

type CertificateFile = { id: string; name: string };

let nextId = 0;

export default function TrainerUploadCertificationsScreen() {
  const { colors } = useTheme();
  const [files, setFiles] = useState<CertificateFile[]>([]);
  const [picking, setPicking] = useState(false);

  const handleAddCertificate = async () => {
    setPicking(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset) return;
      setFiles((prev) => [...prev, { id: String(nextId++), name: asset.name }]);
    } catch {
      Alert.alert('Couldn’t add file', 'Please try again.');
    } finally {
      setPicking(false);
    }
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleContinue = () => {
    router.push('/trainer/selfie-liveness');
  };

  return (
    <Screen padded={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Certifications</Text>
        </View>

        <Text variant="bodySecondary" color="textSecondary" style={styles.description}>
          Optional, but verified trainers with certifications get more bids accepted.
        </Text>

        <View style={styles.files}>
          {files.map((file) => (
            <CertificationFileCard key={file.id} fileName={file.name} onRemove={() => handleRemove(file.id)} />
          ))}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add another certificate"
            disabled={picking}
            onPress={handleAddCertificate}
            style={[styles.addRow, { borderColor: colors.textMuted, opacity: picking ? 0.5 : 1 }]}>
            <PlusIcon size={12} color={colors.textMuted} />
            <Text variant="bodySecondary" color="textMuted">
              Add another certificate
            </Text>
          </Pressable>
        </View>

        <View style={styles.spacer} />

        <Button label="Continue" size="large" fullWidth onPress={handleContinue} style={styles.button} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip for now"
          onPress={handleContinue}
          style={styles.skip}>
          <Text variant="caption" color="textMuted" style={styles.skipLabel}>
            Skip for now
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.s6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  description: {
    marginBottom: Spacing.s6,
  },
  files: {
    gap: Spacing.s3,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Radius.card,
    paddingVertical: Spacing.s4,
  },
  spacer: {
    flex: 1,
    minHeight: Spacing.s5,
  },
  button: {
    marginBottom: Spacing.s3,
  },
  skip: {
    alignSelf: 'center',
    marginBottom: Spacing.s6,
  },
  skipLabel: {
    textDecorationLine: 'underline',
  },
});
