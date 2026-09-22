import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/Screen';
import { IdUploadSlot } from '@/components/trainer';
import { ArrowIcon, BackButton, Button, Text } from '@/components/ui';
import { lightPalette, Radius, Spacing, Typography } from '@/theme';

/**
 * Trainer/Verification "Upload your ID" — first document step after
 * verification-intro. Capture is real (expo-camera) and held in local state
 * only, same as logs/progress-photo.tsx and selfie-liveness.tsx — there's no
 * upload pipeline on the backend yet, so nothing here leaves the device.
 */

type Side = 'front' | 'back';

const BACKGROUND = '#141414';
const BACK_BUTTON_BG = 'rgba(255, 255, 255, 0.14)';
const FRAME_BORDER = 'rgba(255, 255, 255, 0.55)';
const CAPTION_COLOR = 'rgba(255, 255, 255, 0.85)';
const SHUTTER_RING = 'rgba(255, 255, 255, 0.28)';

export default function TrainerUploadIdScreen() {
  const [captures, setCaptures] = useState<Partial<Record<Side, string>>>({});
  const [activeSide, setActiveSide] = useState<Side | null>(null);

  const handleCapture = (side: Side) => setActiveSide(side);

  const handleCaptured = useCallback((side: Side, uri: string) => {
    setCaptures((prev) => ({ ...prev, [side]: uri }));
    setActiveSide(null);
  }, []);

  const handleContinue = () => {
    router.push('/trainer/upload-certifications');
  };

  if (activeSide) {
    return (
      <IdCameraCapture
        side={activeSide}
        onCapture={(uri) => handleCaptured(activeSide, uri)}
        onCancel={() => setActiveSide(null)}
      />
    );
  }

  return (
    <Screen padded={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Upload your ID</Text>
        </View>

        <Text variant="bodySecondary" color="textSecondary" style={styles.description}>
          Aadhaar, PAN, or passport — make sure all four corners are visible.
        </Text>

        <View style={styles.slots}>
          <IdUploadSlot
            label="Front side"
            captured={Boolean(captures.front)}
            imageUri={captures.front}
            onPress={() => handleCapture('front')}
          />
          <IdUploadSlot
            label="Back side"
            captured={Boolean(captures.back)}
            imageUri={captures.back}
            onPress={() => handleCapture('back')}
          />
        </View>

        <View style={styles.spacer} />

        <Button
          label="Continue"
          size="large"
          fullWidth
          disabled={!captures.front || !captures.back}
          onPress={handleContinue}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

/** Full-screen rear-camera capture for one ID side — same dark/oval-less sibling of selfie-liveness.tsx's front-camera capture. */
function IdCameraCapture({
  side,
  onCapture,
  onCancel,
}: {
  side: Side;
  onCapture: (uri: string) => void;
  onCancel: () => void;
}) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const facing: CameraType = 'back';
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleShutter = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      onCapture(photo.uri);
    } catch {
      Alert.alert('Couldn’t take photo', 'Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={[cameraStyles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={cameraStyles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          hitSlop={8}
          onPress={onCancel}
          style={[cameraStyles.backButton, { backgroundColor: BACK_BUTTON_BG }]}>
          <ArrowIcon direction="left" size={18} color={lightPalette.white} />
        </Pressable>
        <RNText style={cameraStyles.title}>{side === 'front' ? 'Front of ID' : 'Back of ID'}</RNText>
      </View>

      {permission?.granted ? (
        <View style={cameraStyles.frameArea}>
          <View style={cameraStyles.cardFrame}>
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />
          </View>
          <RNText style={cameraStyles.caption}>Line up the card inside the frame</RNText>
        </View>
      ) : (
        <View style={cameraStyles.frameArea}>
          <View style={[cameraStyles.cardFrame, { borderStyle: 'dashed' }]} />
          <RNText style={cameraStyles.caption}>
            {permission?.canAskAgain === false
              ? 'Camera access was denied. Enable it in your device settings to continue.'
              : 'Vyaam needs camera access to capture your ID.'}
          </RNText>
          {permission?.canAskAgain !== false && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Grant camera access"
              onPress={requestPermission}
              style={cameraStyles.permissionButton}>
              <RNText style={cameraStyles.permissionButtonLabel}>Enable camera</RNText>
            </Pressable>
          )}
        </View>
      )}

      <View style={cameraStyles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Capture photo"
          disabled={!permission?.granted || capturing}
          onPress={handleShutter}
          style={[cameraStyles.shutterRing, (!permission?.granted || capturing) && cameraStyles.shutterRingDisabled]}>
          <View style={cameraStyles.shutterCore} />
        </Pressable>
      </View>
    </View>
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
  slots: {
    gap: Spacing.s6,
  },
  spacer: {
    flex: 1,
    minHeight: Spacing.s6,
  },
  button: {
    marginBottom: Spacing.s6,
  },
});

const cameraStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h2,
    flex: 1,
    color: lightPalette.white,
  },
  frameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s6,
    paddingHorizontal: Spacing.s6,
  },
  cardFrame: {
    width: '100%',
    aspectRatio: 1.586,
    borderRadius: Radius.card,
    borderWidth: 2,
    borderColor: FRAME_BORDER,
    overflow: 'hidden',
  },
  caption: {
    ...Typography.bodySecondary,
    color: CAPTION_COLOR,
    textAlign: 'center',
    maxWidth: 280,
  },
  permissionButton: {
    height: 44,
    paddingHorizontal: Spacing.s5,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lightPalette.white,
  },
  permissionButtonLabel: {
    ...Typography.h5,
    color: lightPalette.inkDeep,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.s8,
  },
  shutterRing: {
    width: 84,
    height: 84,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: SHUTTER_RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterRingDisabled: {
    opacity: 0.4,
  },
  shutterCore: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: lightPalette.white,
  },
});
