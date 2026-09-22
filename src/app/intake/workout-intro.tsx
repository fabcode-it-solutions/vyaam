import { router } from 'expo-router';

import { IntroScreen } from '@/components/intake/IntroScreen';
import { DumbbellIcon } from '@/components/ui';
import { useIntakeStore } from '@/store/useIntakeStore';
import { useTheme } from '@/theme';

/**
 * Intake/Workout Intro — Figma node 109:334. First screen of the AI
 * workout-plan intake (CLAUDE.md Phase 1).
 */
export default function IntakeWorkoutIntroScreen() {
  const { colors } = useTheme();
  const resetWorkout = useIntakeStore((s) => s.resetWorkout);

  const handleGetStarted = () => {
    resetWorkout();
    router.push('/intake/training-location');
  };

  return (
    <IntroScreen
      icon={<DumbbellIcon size={44} color={colors.accentDeep} />}
      heading="Let’s build your workout plan"
      description="A few quick questions about your space, equipment, and body."
      caption="Takes about 2 minutes"
      ctaLabel="Get started"
      onPressCta={handleGetStarted}
    />
  );
}
