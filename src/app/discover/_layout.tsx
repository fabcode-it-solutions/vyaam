import { Stack } from 'expo-router';

import { useTheme } from '@/theme';

/** Discover's own stack — only overrides what needs it: the filter sheet presents as a dimmed overlay, not a push. */
export default function DiscoverLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen
        name="filter-sheet"
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </Stack>
  );
}
