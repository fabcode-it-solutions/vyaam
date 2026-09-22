import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

/**
 * Client-side Google sign-in: native Google account picker via
 * @react-native-google-signin/google-signin, then exchange its ID token for
 * a Firebase session — mirrors phoneAuth.ts's shape ({firebaseUser, idToken})
 * so callers hand the same idToken to POST /auth/google either way.
 *
 * Requires the Google provider to be enabled in Firebase Console (Firebase
 * only generates the web OAuth client — the `webClientId` below needs —
 * once that's on) and EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID set in .env. Does not
 * run in Expo Go or on web; needs a native dev-client build.
 */

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!webClientId) {
    throw new Error(
      'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not set. Enable Google sign-in for this project in Firebase Console, then copy the generated Web client ID into .env.',
    );
  }
  GoogleSignin.configure({ webClientId });
  configured = true;
}

/**
 * Resolves to `null` if the user dismisses the account picker — not an error.
 *
 * `GoogleSignin.signIn()` silently reuses whichever account is currently
 * cached instead of showing the picker once one has been selected before.
 * Signing out first clears that cache so the native picker always lists
 * every Google account on the device, letting the user switch accounts.
 */
export async function signInWithGoogle() {
  ensureConfigured();
  await GoogleSignin.hasPlayServices();
  await GoogleSignin.signOut();
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) {
    return null;
  }

  const googleIdToken = response.data.idToken;
  if (!googleIdToken) {
    throw new Error('Google sign-in did not return an ID token');
  }

  const credential = GoogleAuthProvider.credential(googleIdToken);
  const userCredential = await signInWithCredential(getAuth(), credential);
  const idToken = await userCredential.user.getIdToken();
  return { firebaseUser: userCredential.user, idToken };
}

export function isGoogleSignInCancelled(error: unknown): boolean {
  return isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED;
}

/** Distinguishes "Play Services missing/outdated" from other failures — worth its own message. */
export function isGooglePlayServicesUnavailable(error: unknown): boolean {
  return isErrorWithCode(error) && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE;
}
