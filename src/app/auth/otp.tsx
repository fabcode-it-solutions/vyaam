import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Screen } from '@/components/Screen';
import { BackButton, Text } from '@/components/ui';
import { continueWithPhoneOtp } from '@/lib/api/endpoints/auth';
import { completeAuthFlow } from '@/lib/auth/completeAuth';
import { confirmPhoneOtp, describeFirebaseAuthError, sendPhoneOtp } from '@/lib/auth/phoneAuth';
import { getOtpConfirmation, setOtpConfirmation } from '@/lib/auth/otpSession';
import { useSessionStore } from '@/store/useSessionStore';
import { Radius, Spacing, useTheme } from '@/theme';

/** Figma node 38:21 (Auth/OTP) — 6 boxes, gap 10, centered caret + resend caption in place of the old Verify/Resend buttons. */
const CODE_LENGTH = 6;
const BOX_GAP = 10;
const RESEND_COOLDOWN_SECONDS = 30;

function formatCountdown(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function AuthOtpScreen() {
  const { colors } = useTheme();
  const phone = useSessionStore((s) => s.phone);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const verify = async (fullCode: string) => {
    const confirmation = getOtpConfirmation();
    if (!confirmation) {
      setError('Your session expired. Go back and resend the code.');
      return;
    }
    setVerifying(true);
    setError(undefined);
    try {
      const { idToken } = await confirmPhoneOtp(confirmation, fullCode);
      const authResult = await continueWithPhoneOtp(idToken);
      await completeAuthFlow(authResult);
    } catch {
      setError('That code didn’t work. Check it and try again.');
      setCode('');
    } finally {
      setVerifying(false);
    }
  };

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH) {
      verify(digits);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !phone) return;
    setError(undefined);
    setCode('');
    try {
      const confirmation = await sendPhoneOtp(phone);
      setOtpConfirmation(confirmation);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      if (__DEV__) console.error('resend sendPhoneOtp failed', err);
      setError(describeFirebaseAuthError(err));
    }
  };

  return (
    <Screen padded={false}>
      <View style={styles.content}>
        <BackButton onPress={() => router.back()} style={styles.backButton} />

        <View style={styles.header}>
          <Text variant="h2">Verify your number</Text>
          <View style={styles.subheader}>
            <Text variant="body" color="textSecondary">
              We sent a 6-digit code to {phone ?? 'your number'}
            </Text>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text variant="caption" style={styles.changeNumber}>
                Change number
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.otpSection}>
          <Pressable onPress={() => inputRef.current?.focus()} style={styles.boxRow}>
            {Array.from({ length: CODE_LENGTH }).map((_, i) => {
              const filled = i < code.length;
              const focused = i === code.length;
              return (
                <View
                  key={i}
                  style={[
                    styles.box,
                    {
                      backgroundColor: colors.surface,
                      borderColor: error ? colors.danger : focused ? colors.brand : colors.border,
                      borderWidth: focused ? 2 : 1.5,
                    },
                  ]}>
                  {filled && <Text variant="h3">{code[i]}</Text>}
                  {focused && !filled && <Caret color={colors.brand} />}
                </View>
              );
            })}
          </Pressable>
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            autoFocus
            style={styles.hiddenInput}
            accessibilityLabel="One-time verification code"
          />

          {error ? (
            <Text variant="caption" color="danger" style={styles.helper}>
              {error}
            </Text>
          ) : verifying ? (
            <Text variant="caption" color="textMuted" style={styles.helper}>
              Verifying…
            </Text>
          ) : (
            <Pressable onPress={handleResend} disabled={cooldown > 0} hitSlop={8}>
              <Text variant="caption" color="textMuted" style={styles.helper}>
                {cooldown > 0 ? `Resend code in ${formatCountdown(cooldown)}` : 'Resend code'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Screen>
  );
}

/** The focused box's blinking text-cursor stand-in (Figma node 38:34, a static rectangle there). */
function Caret({ color }: { color: string }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0, { duration: 500, easing: Easing.linear }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.caret, { backgroundColor: color }, animatedStyle]} />;
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.s6,
  },
  backButton: {
    marginTop: Spacing.s3,
  },
  header: {
    marginTop: Spacing.s8,
    gap: Spacing.s3,
  },
  subheader: {
    gap: Spacing.s2,
  },
  changeNumber: {
    textDecorationLine: 'underline',
  },
  otpSection: {
    marginTop: Spacing.s7,
    alignItems: 'center',
    gap: Spacing.s6,
  },
  boxRow: {
    flexDirection: 'row',
    gap: BOX_GAP,
    alignSelf: 'stretch',
  },
  box: {
    flex: 1,
    height: 56,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caret: {
    width: 2,
    height: 24,
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  helper: {
    textAlign: 'center',
  },
});
