import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Input, LogoMark, Text } from '@/components/ui';
import { continueWithApple, continueWithGoogle } from '@/lib/api/endpoints/auth';
import { isAppleSignInAvailable, isAppleSignInCancelled, signInWithApple } from '@/lib/auth/appleAuth';
import { completeAuthFlow } from '@/lib/auth/completeAuth';
import { isGoogleSignInCancelled, signInWithGoogle } from '@/lib/auth/googleAuth';
import { setOtpConfirmation } from '@/lib/auth/otpSession';
import { describeFirebaseAuthError, sendPhoneOtp } from '@/lib/auth/phoneAuth';
import { useSessionStore } from '@/store/useSessionStore';
import { Spacing, useTheme } from '@/theme';

/**
 * Auth/Phone — Figma node 36:9
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=36-9).
 *
 * "Continue with Google"/"Continue with Apple" have no icon glyph in the
 * design, just the label. Both need a native dev-client build to actually
 * run (not Expo Go, not web) — see googleAuth.ts/appleAuth.ts. Google also
 * needs EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID set once the provider is enabled
 * in Firebase Console; Apple only ever renders on iOS with the "Sign in
 * with Apple" capability on the App ID, so the button hides everywhere else
 * per Apple's own guideline against showing a non-functional button.
 */

/** India launch (Hisar/Delhi NCR per CLAUDE.md) — country code is fixed rather than a picker for now. */
const COUNTRY_CODE = '+91';

function isValidLocalNumber(digits: string) {
  return /^[6-9]\d{9}$/.test(digits);
}

export default function AuthPhoneScreen() {
  const { colors } = useTheme();
  const setPhone = useSessionStore((s) => s.setPhone);
  const [digits, setDigits] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [socialError, setSocialError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const anyLoading = loading || googleLoading || appleLoading;

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    isAppleSignInAvailable().then(setAppleAvailable);
  }, []);

  const handleBlur = () => {
    if (digits.length > 0 && !isValidLocalNumber(digits)) {
      setError('Enter a valid 10-digit mobile number');
    } else {
      setError(undefined);
    }
  };

  const handleSubmit = async () => {
    if (!isValidLocalNumber(digits)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError(undefined);
    setLoading(true);
    const phoneE164 = `${COUNTRY_CODE}${digits}`;
    try {
      const confirmation = await sendPhoneOtp(phoneE164);
      setOtpConfirmation(confirmation);
      setPhone(phoneE164);
      router.push('/auth/otp');
    } catch (err) {
      if (__DEV__) console.error('sendPhoneOtp failed', err);
      setError(describeFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = useCallback(async () => {
    setSocialError(undefined);
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result) return; // user dismissed the account picker
      const authResult = await continueWithGoogle(result.idToken);
      await completeAuthFlow(authResult);
    } catch (err) {
      if (isGoogleSignInCancelled(err)) return;
      if (__DEV__) console.error('signInWithGoogle failed', err);
      setSocialError(describeFirebaseAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  const handleApple = useCallback(async () => {
    setSocialError(undefined);
    setAppleLoading(true);
    try {
      const result = await signInWithApple();
      if (!result) return; // user dismissed the Apple sheet
      const authResult = await continueWithApple(result.idToken, result.fullName);
      await completeAuthFlow(authResult);
    } catch (err) {
      if (isAppleSignInCancelled(err)) return;
      if (__DEV__) console.error('signInWithApple failed', err);
      setSocialError(describeFirebaseAuthError(err));
    } finally {
      setAppleLoading(false);
    }
  }, []);

  return (
    <Screen>
      <LogoMark size={44} tile style={styles.logo} />

      <View style={styles.header}>
        <Text variant="h2">What’s your phone number?</Text>
        <Text variant="body" color="textSecondary">
          We’ll text you a code to make sure it’s really you.
        </Text>
      </View>

      <Input
        label="Phone number"
        keyboardType="number-pad"
        maxLength={10}
        value={digits}
        onChangeText={(t) => setDigits(t.replace(/\D/g, ''))}
        onBlur={handleBlur}
        error={error}
        autoFocus
        leadingIcon={
          <Text variant="body" color="textSecondary">
            {COUNTRY_CODE}
          </Text>
        }
        placeholder="98765 43210"
      />

      <View style={styles.actions}>
        <Button
          label="Continue"
          size="large"
          fullWidth
          loading={loading}
          disabled={digits.length !== 10 || anyLoading}
          onPress={handleSubmit}
        />
        <Text variant="caption" color="textMuted" style={styles.legal}>
          By continuing, you agree to our Terms and Privacy Policy.
        </Text>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text variant="caption" color="textMuted">
            or
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.socialButtons}>
          <Button
            label="Continue with Google"
            variant="secondary"
            size="medium"
            fullWidth
            loading={googleLoading}
            disabled={anyLoading && !googleLoading}
            onPress={handleGoogle}
          />
          {appleAvailable && (
            <Button
              label="Continue with Apple"
              variant="secondary"
              size="medium"
              fullWidth
              loading={appleLoading}
              disabled={anyLoading && !appleLoading}
              onPress={handleApple}
            />
          )}
        </View>

        {socialError && (
          <Text variant="caption" color="danger" style={styles.legal}>
            {socialError}
          </Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginTop: Spacing.s2,
    marginBottom: Spacing.s8,
  },
  header: {
    marginBottom: Spacing.s6,
    gap: Spacing.s3,
  },
  actions: {
    marginTop: Spacing.s6,
    gap: Spacing.s4,
  },
  legal: {
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s4,
    marginTop: Spacing.s5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  socialButtons: {
    gap: Spacing.s3,
  },
});
