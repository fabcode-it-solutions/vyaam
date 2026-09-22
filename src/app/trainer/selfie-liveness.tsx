import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect } from 'react-native-svg';

import { ArrowIcon } from '@/components/ui';
import { useSessionStore } from '@/store/useSessionStore';
import { lightPalette, Radius, Spacing, Typography } from '@/theme';

/**
 * Trainer/Verification "Look at the camera" — liveness capture step after
 * upload-certifications, and the last step of the flow. The camera preview
 * is real (expo-camera) but only ever visible through the oval cutout.
 * Clipped with `overflow: hidden` + `borderRadius` (a capsule, not a true
 * ellipse — RN has no elliptical clip) rather than an alpha mask:
 * expo-camera's Android preview is a SurfaceView-backed PreviewView that
 * renders on its own hardware layer, so MaskedView-style alpha masks
 * composite it as blank instead of clipping it. Everything outside the
 * capsule stays the fixed dark backdrop. Fixed dark background regardless of
 * theme, same fixed-brand exception onboarding.tsx documents, since a real
 * camera preview is dark either way.
 *
 * There's no liveness-detection or upload pipeline on the backend yet, so a
 * successful capture just marks the on-device flow complete (see
 * trainerVerificationDocsSubmitted on useSessionStore) and moves on to the
 * "under review" screen.
 */

const CAMERA_FACING: CameraType = 'front';
const BACKGROUND = '#141414';
const BACK_BUTTON_BG = 'rgba(255, 255, 255, 0.14)';
const OVAL_SCRIM = 'rgba(255, 255, 255, 0.06)';
const CAPTION_COLOR = 'rgba(255, 255, 255, 0.75)';
const SHUTTER_RING = 'rgba(255, 255, 255, 0.28)';
const OVAL_WIDTH = 190;
const OVAL_HEIGHT = 250;
const OVAL_STROKE = 3;
const OVAL_CANVAS_SIZE = { width: OVAL_WIDTH + OVAL_STROKE * 2, height: OVAL_HEIGHT + OVAL_STROKE * 2 };

export default function TrainerSelfieLivenessScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const setTrainerVerificationDocsSubmitted = useSessionStore((s) => s.setTrainerVerificationDocsSubmitted);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      await cameraRef.current.takePictureAsync();
      setTrainerVerificationDocsSubmitted(true);
      router.replace('/trainer/verification-pending');
    } catch {
      Alert.alert('Couldn’t take photo', 'Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: BACK_BUTTON_BG }]}>
          <ArrowIcon direction="left" size={18} color={lightPalette.white} />
        </Pressable>
        <RNText style={styles.title}>Look at the camera</RNText>
      </View>

      {permission?.granted ? (
        <View style={styles.frameArea}>
          <View style={styles.ovalWrap}>
            <View style={styles.cameraClip}>
              <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={CAMERA_FACING} />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: OVAL_SCRIM }]} />
            </View>

            <Svg
              style={StyleSheet.absoluteFill}
              width={OVAL_CANVAS_SIZE.width}
              height={OVAL_CANVAS_SIZE.height}
              pointerEvents="none">
              <Rect
                x={OVAL_STROKE}
                y={OVAL_STROKE}
                width={OVAL_WIDTH}
                height={OVAL_HEIGHT}
                rx={OVAL_WIDTH / 2}
                ry={OVAL_WIDTH / 2}
                fill="none"
                stroke={lightPalette.saffron}
                strokeWidth={OVAL_STROKE}
              />
            </Svg>
          </View>

          <RNText style={styles.caption}>Fit your face inside the oval and hold still</RNText>
        </View>
      ) : (
        <View style={styles.frameArea}>
          <Svg width={OVAL_CANVAS_SIZE.width} height={OVAL_CANVAS_SIZE.height}>
            <Rect
              x={OVAL_STROKE}
              y={OVAL_STROKE}
              width={OVAL_WIDTH}
              height={OVAL_HEIGHT}
              rx={OVAL_WIDTH / 2}
              ry={OVAL_WIDTH / 2}
              fill={OVAL_SCRIM}
              stroke={lightPalette.saffron}
              strokeWidth={OVAL_STROKE}
            />
          </Svg>

          <RNText style={styles.caption}>
            {permission?.canAskAgain === false
              ? 'Camera access was denied. Enable it in your device settings to continue.'
              : 'Vyaam needs camera access to verify it’s really you.'}
          </RNText>
          {permission?.canAskAgain !== false && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Grant camera access"
              onPress={requestPermission}
              style={styles.permissionButton}>
              <RNText style={styles.permissionButtonLabel}>Enable camera</RNText>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Capture selfie"
          disabled={!permission?.granted || capturing}
          onPress={handleCapture}
          style={[styles.shutterRing, (!permission?.granted || capturing) && styles.shutterRingDisabled]}>
          <View style={styles.shutterCore} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 999,
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
  ovalWrap: {
    width: OVAL_CANVAS_SIZE.width,
    height: OVAL_CANVAS_SIZE.height,
  },
  cameraClip: {
    position: 'absolute',
    top: OVAL_STROKE,
    left: OVAL_STROKE,
    width: OVAL_WIDTH,
    height: OVAL_HEIGHT,
    borderRadius: OVAL_WIDTH / 2,
    overflow: 'hidden',
    backgroundColor: BACKGROUND,
  },
  caption: {
    ...Typography.bodySecondary,
    color: CAPTION_COLOR,
    textAlign: 'center',
    maxWidth: 240,
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
