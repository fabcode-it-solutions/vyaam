import type { OtpConfirmation } from './phoneAuth';

/**
 * Holds the in-flight Firebase confirmation between the Phone and OTP
 * screens. Deliberately not in Zustand/persisted state — it wraps a native
 * SDK object that can't be serialized, and only needs to survive one
 * in-memory navigation hop.
 */
let confirmation: OtpConfirmation | null = null;

export function setOtpConfirmation(next: OtpConfirmation | null) {
  confirmation = next;
}

export function getOtpConfirmation() {
  return confirmation;
}
