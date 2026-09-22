import { router } from 'expo-router';
import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, CameraIcon, Card, CardIcon, DocumentIcon, ShieldCheckIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Trainer/Verification intro — soft-ask before the document/selfie capture
 * flow (upload-id → upload-certifications → selfie-liveness).
 */

type VerificationItem = {
  key: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  title: string;
  subtitle: string;
};

const ITEMS: VerificationItem[] = [
  {
    key: 'government-id',
    icon: CardIcon,
    title: 'Government ID',
    subtitle: 'A clear photo of your Aadhaar, PAN, or passport',
  },
  {
    key: 'certifications',
    icon: DocumentIcon,
    title: 'Certifications',
    subtitle: 'Any fitness or yoga certificates you hold',
  },
  {
    key: 'selfie',
    icon: CameraIcon,
    title: 'A quick selfie',
    subtitle: 'To confirm you match your ID',
  },
];

export default function TrainerVerificationIntroScreen() {
  const { colors } = useTheme();

  const handleGetStarted = () => {
    router.push('/trainer/upload-id');
  };

  return (
    <Screen padded={false}>
      <View style={styles.content}>
        <BackButton onPress={() => router.back()} style={styles.backButton} />

        <View style={[styles.iconCircle, { backgroundColor: colors.accentTint }]}>
          <ShieldCheckIcon size={40} color={colors.accentDeep} />
        </View>

        <Text variant="h1" style={styles.heading}>
          Let’s verify your identity
        </Text>
        <Text variant="bodySecondary" color="textSecondary" style={styles.description}>
          Verification builds trust with customers and unlocks bidding. It takes about 5 minutes and is usually
          reviewed within 24 hours.
        </Text>

        <View style={styles.items}>
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.key} padded={false} style={styles.itemCard}>
                <View style={styles.itemRow}>
                  <View style={[styles.itemIcon, { backgroundColor: colors.border }]}>
                    <Icon size={18} color={colors.textPrimary} />
                  </View>
                  <View style={styles.itemText}>
                    <Text variant="h5">{item.title}</Text>
                    <Text variant="bodySecondary" color="textSecondary">
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        <View style={styles.spacer} />

        <Button label="Get started" size="large" fullWidth onPress={handleGetStarted} style={styles.button} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.s6,
  },
  backButton: {
    marginTop: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s6,
  },
  heading: {
    marginBottom: Spacing.s3,
  },
  description: {
    marginBottom: Spacing.s6,
  },
  items: {
    gap: Spacing.s3,
  },
  itemCard: {
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  spacer: {
    flex: 1,
    minHeight: Spacing.s6,
  },
  button: {
    marginBottom: Spacing.s6,
  },
});
