import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { darkTheme, lightTheme, type Theme } from './theme';

/**
 * Theme (light/dark, plus which palette is active) is the narrow,
 * infrequently-changing global state CLAUDE.md calls out as the one
 * legitimate use of React Context in this app — everything else
 * cross-screen lives in Zustand.
 */

const STORAGE_KEY = 'vyaam.themeOverride';

export type ThemeOverride = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  /** 'system' | 'light' | 'dark' — the user's explicit Settings choice, or 'system' if unset. */
  override: ThemeOverride;
  /** Persist an explicit choice. Pass 'system' to go back to following the OS setting. */
  setOverride: (next: ThemeOverride) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useSystemColorScheme();
  const [override, setOverrideState] = useState<ThemeOverride>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (cancelled) return;
      if (stored === 'light' || stored === 'dark') {
        setOverrideState(stored);
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setOverride = useCallback((next: ThemeOverride) => {
    setOverrideState(next);
    if (next === 'system') {
      AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      AsyncStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  // Before hydration completes, fall back to the system scheme rather than
  // flashing light-then-dark once the persisted override loads.
  const activeMode = hydrated && override !== 'system' ? override : (systemScheme ?? 'light');
  const theme = activeMode === 'dark' ? darkTheme : lightTheme;

  const value = useMemo(
    () => ({ theme, override, setOverride }),
    [theme, override, setOverride],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

export function useTheme(): Theme {
  return useThemeContext().theme;
}

/** For the Settings screen's dark-mode toggle. */
export function useThemeSettings() {
  const { override, setOverride } = useThemeContext();
  return { override, setOverride };
}
