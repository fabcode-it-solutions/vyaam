import { router } from 'expo-router';

import { IntroScreen } from '@/components/intake/IntroScreen';
import { ForkKnifeIcon, IconButton, ListIcon } from '@/components/ui';
import { useIntakeStore } from '@/store/useIntakeStore';
import { useTheme } from '@/theme';

/**
 * Intake/Diet Intro — Figma node 58:51. First screen of the AI diet-plan
 * intake (CLAUDE.md Phase 1).
 */
export default function IntakeDietIntroScreen() {
  const { colors } = useTheme();
  const resetDiet = useIntakeStore((s) => s.resetDiet);

  const handleGetStarted = () => {
    resetDiet();
    router.push('/intake/goal');
  };

  return (
    <IntroScreen
      icon={<ForkKnifeIcon size={44} color={colors.accentDeep} />}
      heading="Let’s build your diet plan"
      description="A few quick questions so it actually fits your life, not a generic template."
      caption="Takes about 2 minutes"
      ctaLabel="Get started"
      onPressCta={handleGetStarted}
      // topRightAction={
      //   <IconButton
      //     accessibilityLabel="Dev navigator — jump to any screen"
      //     icon={<ListIcon size={20} color={colors.textPrimary} />}
      //     variant="surface"
      //     onPress={() => router.push('/__dev_nav')}
      //   />
      // }
    />
  );
}
