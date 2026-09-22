import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ArrowIcon, Button, IconButton, Input, SearchIcon, Text } from '@/components/ui';
import { TrainerShareRow, type ConnectedTrainer } from '@/components/trainer';
import { sharePlan, type PlanType } from '@/lib/api/endpoints/plan';
import { ApiError } from '@/lib/api/errors';
import { Spacing, useTheme } from '@/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Illustrative — matches the Figma copy exactly (node 72:120). The roster
// itself needs a real "connections" endpoint (Phase 2 marketplace), not a
// hardcoded list — the share action below is wired to the real POST
// /plans/share endpoint (see plan.service.ts sharePlan), which currently
// always rejects method:'trainer' with NOT_AVAILABLE server-side until the
// marketplace engagement flow ships.
const CONNECTED_TRAINERS: ConnectedTrainer[] = [
  { id: 'anjali', name: 'Anjali Kaushik', specialty: 'Yoga', rating: 4.8, shared: true },
  { id: 'rohit', name: 'Rohit Sharma', specialty: 'Strength', rating: 4.9, shared: false },
  { id: 'priya', name: 'Priya Menon', specialty: 'Pilates', rating: 4.7, shared: false },
];

/**
 * Plans/Share With Trainer — Figma node 72:120
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=72-120).
 */
export default function ShareWithTrainerScreen() {
  const { colors } = useTheme();
  const { planType: planTypeParam } = useLocalSearchParams<{ planType?: string }>();
  const planType: PlanType = planTypeParam === 'workout' ? 'workout' : 'diet';
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sharingTrainerId, setSharingTrainerId] = useState<string | null>(null);

  const trainers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONNECTED_TRAINERS;
    return CONNECTED_TRAINERS.filter(
      (t) => t.name.toLowerCase().includes(q) || t.specialty.toLowerCase().includes(q),
    );
  }, [query]);

  const handleSendEmail = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      Alert.alert('Enter a valid email', 'Check the address and try again.');
      return;
    }

    setSendingEmail(true);
    try {
      await sharePlan({ planType, method: 'email', email: trimmedEmail });
      Alert.alert('Sent', `A PDF copy of your ${planType} plan is on its way to ${trimmedEmail}.`);
      setEmail('');
    } catch (err) {
      Alert.alert(
        'Couldn’t send',
        err instanceof ApiError ? err.message : 'Something went wrong. Check your connection and try again.',
      );
    } finally {
      setSendingEmail(false);
    }
  };

  const handleShare = async (trainer: ConnectedTrainer) => {
    setSharingTrainerId(trainer.id);
    try {
      await sharePlan({ planType, method: 'trainer', trainerId: trainer.id });
      Alert.alert('Shared', `Your ${planType} plan was shared with ${trainer.name}.`);
    } catch (err) {
      Alert.alert(
        'Couldn’t share',
        err instanceof ApiError ? err.message : 'Something went wrong. Check your connection and try again.',
      );
    } finally {
      setSharingTrainerId(null);
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <IconButton
          accessibilityLabel="Go back"
          icon={<ArrowIcon direction="left" size={18} color={colors.textPrimary} />}
          onPress={() => router.back()}
          style={styles.backButton}
        />

        <View style={styles.heading}>
          <Text variant="h2">
            {/* Share with a trainer */}
            Share to anyone
            </Text>
          <Text variant="bodySecondary" color="textSecondary">
            Get{" "}
             {/* expert  */}
             feedback on your AI plan before you start.
          </Text>
        </View>

        <View style={styles.emailSection}>
          <Text variant="h4">Share via email</Text>
          <Text variant="caption" color="textMuted">
            Sends a PDF copy of your plan — works for anyone, even outside Vyaam.
          </Text>
        </View>

        <View style={styles.emailRow}>
          <View style={styles.emailInput}>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <Button
            label="Send"
            variant="secondary"
            loading={sendingEmail}
            disabled={sendingEmail}
            onPress={handleSendEmail}
          />
        </View>

        {/* <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text variant="caption" color="textMuted">
            or
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <Text variant="h4" style={styles.connectedTitle}>
          Share with a connected trainer
        </Text>

        <View style={styles.searchInput}>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Search your connected trainers…"
            leadingIcon={<SearchIcon size={18} color={colors.textMuted} />}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.trainerList}>
          {trainers.map((trainer) => (
            <TrainerShareRow
              key={trainer.id}
              trainer={trainer}
              onShare={handleShare}
              sharing={sharingTrainerId === trainer.id}
              disabled={sharingTrainerId !== null && sharingTrainerId !== trainer.id}
            />
          ))}
        </View> */}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.s6,
    paddingBottom: Spacing.s8,
  },
  backButton: {
    marginTop: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  heading: {
    gap: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  emailSection: {
    gap: 6,
    marginBottom: Spacing.s5,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  emailInput: {
    flex: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s6,
    marginBottom: Spacing.s6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  connectedTitle: {
    marginBottom: Spacing.s4,
  },
  searchInput: {
    marginBottom: Spacing.s5,
  },
  trainerList: {
    gap: Spacing.s3,
  },
});
