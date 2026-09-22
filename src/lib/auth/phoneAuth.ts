import { getAuth, signInWithPhoneNumber, signOut, type ConfirmationResult } from '@react-native-firebase/auth';

/**
 * Client-side phone OTP via Firebase Auth (native — real SMS auto-retrieval
 * on Android, silent APNs verification on iOS, no reCAPTCHA challenge).
 * Uses the modular API shape (@react-native-firebase/auth v22+), not the
 * older `auth().signInWithPhoneNumber()` namespaced API.
 *
 * Requires GoogleService-Info.plist / google-services.json in the project
 * root and a custom dev-client build — this does not run in Expo Go.
 */

export type OtpConfirmation = ConfirmationResult;

/** phoneE164 must include the country code, e.g. "+919876543210". */
export function sendPhoneOtp(phoneE164: string): Promise<OtpConfirmation> {
  return signInWithPhoneNumber(getAuth(), phoneE164);
}

export async function confirmPhoneOtp(confirmation: OtpConfirmation, code: string) {
  const credential = await confirmation.confirm(code);
  if (!credential?.user) {
    throw new Error('OTP confirmation did not return a user');
  }
  // The real backend contract (backend/postman/Vyaam-Backend.postman_collection.json)
  // is POST /auth/phone-otp { idToken } — a single exchange, not the two-step
  // { phone, otp } pair the older API spec doc described. See lib/api/endpoints/auth.ts.
  const idToken = await credential.user.getIdToken();
  return { firebaseUser: credential.user, idToken };
}

export function signOutFirebase() {
  return signOut(getAuth());
}

/**
 * Firebase Auth errors carry a `.code` like "auth/invalid-phone-number" —
 * translate the common ones so the UI can say something more useful than a
 * blanket "check the number", which is misleading for e.g. a missing native
 * module (Expo Go instead of the dev client) or a Play Integrity/App Check
 * misconfiguration that has nothing to do with what the user typed.
 */
export function describeFirebaseAuthError(error: unknown): string {
  const code = isFirebaseAuthError(error) ? error.code : undefined;
  switch (code) {
    case 'auth/invalid-phone-number':
      return 'That phone number doesn’t look valid. Double-check the digits.';
    case 'auth/too-many-requests':
      return 'Too many attempts from this number. Wait a bit before trying again.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded for this project right now. Try again later.';
    case 'auth/app-not-authorized':
    case 'auth/missing-client-identifier':
    case 'auth/captcha-check-failed':
      return 'This app isn’t verified to send SMS yet — check the Firebase project setup.';
    case 'auth/operation-not-allowed':
      return 'Sign-in isn’t enabled for this Firebase project (or this number’s region isn’t allowed yet).';
    case 'auth/billing-not-enabled':
      return 'SMS sign-in isn’t available yet — this Firebase project needs billing enabled (or use a registered test number during development).';
    case 'auth/network-request-failed':
      return 'No network connection. Check your connection and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'That email is already linked to a different sign-in method. Try phone number instead.';
    case 'auth/invalid-credential':
      return 'That sign-in didn’t go through. Try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support if that seems wrong.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

function isFirebaseAuthError(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string';
}
