import { Platform, type ViewStyle } from 'react-native';

import type { Colors } from './colors';

/**
 * Vyaam elevation tokens — Brand Guide section 10 Tokens.
 * The brand is intentionally flat: cards get a hairline border, never a
 * shadow. Sheets get one soft shadow so they read as floating above content.
 * Modals are a scrim, not a shadow. Never stack more than two floating
 * layers (sheet + modal) — a third means it should have been its own screen.
 */
export function buildElevation(colors: Colors) {
  return {
    flat: {
      backgroundColor: colors.background,
    } satisfies ViewStyle,

    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    } satisfies ViewStyle,

    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      ...Platform.select<ViewStyle>({
        android: { elevation: 12 },
        default: {
          shadowColor: 'rgba(10,38,33,1)',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
      }),
    } satisfies ViewStyle,

    /** Apply to the full-screen backdrop behind a modal; the modal content itself uses `card`/`sheet`. */
    modalScrim: 'rgba(10,38,33,0.45)',
  };
}
