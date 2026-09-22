import { getAuth, OAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

/**
 * Client-side Apple sign-in: native Apple modal via expo-apple-authentication
 * (iOS only), then exchange its identity token for a Firebase session —
 * mirrors phoneAuth.ts's shape ({firebaseUser, idToken}) plus `fullName`,
 * which Apple only ever returns on a user's *first* authorization of this
 * app, so it must be captured here and forwarded to POST /auth/apple
 * (endpoints/auth.ts's `continueWithApple`) rather than re-requested later.
 *
 * Sends a hashed nonce to Apple and the matching raw nonce to Firebase per
 * Apple/Firebase's replay-protection guidance. Requires the "Sign in with
 * Apple" capability enabled on the app's Apple Developer App ID and only
 * works in a native dev-client build — not Expo Go, not web, not Android.
 */

export async function isAppleSignInAvailable() {
  return Platform.OS === 'ios' && (await AppleAuthentication.isAvailableAsync());
}

/** Resolves to `null` if the user dismisses the Apple sheet — not an error. */
export async function signInWithApple() {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

  let appleCredential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });
  } catch (error) {
    if (isAppleSignInCancelled(error)) return null;
    throw error;
  }

  if (!appleCredential.identityToken) {
    throw new Error('Apple sign-in did not return an identity token');
  }

  const provider = new OAuthProvider('apple.com');
  const firebaseCredential = provider.credential({
    idToken: appleCredential.identityToken,
    rawNonce,
  });
  const userCredential = await signInWithCredential(getAuth(), firebaseCredential);
  const idToken = await userCredential.user.getIdToken();

  const fullName = appleCredential.fullName
    ? AppleAuthentication.formatFullName(appleCredential.fullName) || undefined
    : undefined;

  return { firebaseUser: userCredential.user, idToken, fullName };
}

export function isAppleSignInCancelled(error: unknown): boolean {
  return isErrorWithCode(error) && error.code === 'ERR_REQUEST_CANCELED';
}

function isErrorWithCode(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string';
}
