import { Platform } from 'react-native';

/**
 * Dev default only. `localhost` means different things depending on where
 * the JS runs:
 * - iOS simulator / web: the host machine, so `localhost` works.
 * - Android emulator: `10.0.2.2` is the documented alias for the host's
 *   loopback — plain `localhost` resolves to the emulator itself.
 * - A physical device (either OS): neither works. It needs the host
 *   machine's LAN IP.
 *
 * Set EXPO_PUBLIC_API_BASE_URL in .env to override this for your setup
 * (e.g. a physical device, or a deployed staging backend) — this default is
 * a starting point, not something to rely on for real device testing.
 */
function defaultBaseUrl() {
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:4000/api`;
}

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? defaultBaseUrl();
