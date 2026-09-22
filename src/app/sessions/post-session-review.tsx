import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Input, Pill, StarRatingInput, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Sessions/Post-Session Review — rate a completed session, opened from
 * Check-in's "Leave a review". Trainer/session summary below is
 * illustrative, keyed off the `id` route param; needs the real reviews
 * endpoint rather than a coming-soon alert. "What stood out?" tags are the
 * fixed set from Figma — no tag-management endpoint exists to source these
 * from instead.
 */

type ReviewSubject = {
  trainerName: string;
  sessionProgress: string;
  whenLabel: string;
};

const REVIEW_SUBJECTS: Record<string, ReviewSubject> = {
  'session-1': { trainerName: 'Anjali Kaushik', sessionProgress: 'Session 3 of 4', whenLabel: 'Yesterday' },
  'session-2': { trainerName: 'Rohit Sharma', sessionProgress: 'Session 5 of 8', whenLabel: '3 days ago' },
  'session-3': { trainerName: 'Anjali Kaushik', sessionProgress: 'Session 4 of 4', whenLabel: 'Yesterday' },
};

const STANDOUT_TAGS = ['Punctual', 'Knowledgeable', 'Motivating', 'Great communication', 'Flexible'];
const DEFAULT_TAGS = ['Punctual', 'Knowledgeable'];

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function PostSessionReviewScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const subject = (id && REVIEW_SUBJECTS[id]) || REVIEW_SUBJECTS['session-1'];

  const [rating, setRating] = useState(4);
  const [selectedTags, setSelectedTags] = useState<string[]>(DEFAULT_TAGS);
  const [details, setDetails] = useState('');

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }, []);

  const handleSubmit = useCallback(() => comingSoon('Submitting your review'), []);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Rate your session</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.trainerBlock}>
          <View style={[styles.avatar, { backgroundColor: colors.border }]} />
          <Text variant="h3" style={styles.trainerName}>
            {subject.trainerName}
          </Text>
          <Text variant="caption" color="textMuted">
            {subject.sessionProgress} · {subject.whenLabel}
          </Text>
        </View>

        <View style={styles.starsRow}>
          <StarRatingInput value={rating} onChange={setRating} />
        </View>

        <View style={styles.section}>
          <Text variant="h5">What stood out?</Text>
          <View style={styles.tagsRow}>
            {STANDOUT_TAGS.map((tag) => (
              <Pill key={tag} label={tag} selected={selectedTags.includes(tag)} onPress={() => toggleTag(tag)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="caption" color="textSecondary">
            Tell us more (optional)
          </Text>
          <Input
            hideLabel
            label="Review details"
            value={details}
            onChangeText={setDetails}
            placeholder="Share details that would help other customers…"
            multiline
          />
        </View>

        <Button
          label="Submit review"
          size="large"
          fullWidth
          disabled={rating === 0}
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s4,
  },
  content: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s6,
  },
  trainerBlock: {
    alignItems: 'center',
    gap: Spacing.s2,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  trainerName: {
    marginTop: Spacing.s2,
  },
  starsRow: {
    alignItems: 'center',
  },
  section: {
    gap: Spacing.s3,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
  submitButton: {
    marginTop: Spacing.s1,
  },
});
