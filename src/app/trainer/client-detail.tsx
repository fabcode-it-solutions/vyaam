import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { TrainerCurrentPlanBanner, TrainerSharedItemRow, type TrainerSharedItem } from '@/components/trainer';
import { ArrowIcon, Button, ChatBubbleIcon, IconButton, Pill, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Trainer/Client Detail — opened from an active row on client-list. Client
 * name, plan, and shared items below are illustrative (matches Figma's
 * "Priya Sharma" example); needs the real client-detail endpoint, keyed off
 * the `id` route param, rather than static data.
 */
type ClientTab = 'plan' | 'logs' | 'sessions';

const TABS: { key: ClientTab; label: string }[] = [
  { key: 'plan', label: 'Plan' },
  { key: 'logs', label: 'Logs' },
  { key: 'sessions', label: 'Sessions' },
];

const CLIENT_NAME = 'Priya Sharma';
const CLIENT_SUBTITLE = 'Upper body strength · Session 3 of 4';

const SHARED_ITEMS: TrainerSharedItem[] = [
  { id: 'weight-log', title: 'Weight log', subtitle: '68.0 kg, logged today' },
  { id: 'progress-photos', title: 'Progress photos', subtitle: '3 photos shared' },
  { id: 'workout-logs', title: 'Workout logs', subtitle: 'Last 4 sessions' },
];

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function TrainerClientDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [activeTab, setActiveTab] = useState<ClientTab>('plan');

  const handleOpenChat = useCallback(
    () => router.push({ pathname: '/chat/shared-plan', params: { id, name: CLIENT_NAME } }),
    [id],
  );
  const handleEditPlan = useCallback(
    () => router.push({ pathname: '/trainer/client-plan-editor', params: { id, name: CLIENT_NAME } }),
    [id],
  );
  const handleSharedItemPress = useCallback((item: TrainerSharedItem) => comingSoon(item.title), []);

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <IconButton
            accessibilityLabel="Go back"
            icon={<ArrowIcon direction="left" size={18} color={colors.textPrimary} />}
            onPress={() => router.back()}
          />
          <IconButton
            accessibilityLabel="Message client"
            icon={<ChatBubbleIcon size={20} color={colors.textPrimary} />}
            variant="surface"
            onPress={handleOpenChat}
          />
        </View>

        <View style={[styles.avatar, { backgroundColor: colors.border }]} />
        <Text variant="h2" style={styles.name}>
          {CLIENT_NAME}
        </Text>
        <Text variant="bodySecondary" color="textSecondary" style={styles.subtitle}>
          {CLIENT_SUBTITLE}
        </Text>

        <View style={styles.tabsRow}>
          {TABS.map((tab) => (
            <Pill key={tab.key} label={tab.label} selected={activeTab === tab.key} onPress={() => setActiveTab(tab.key)} />
          ))}
        </View>

        <TrainerCurrentPlanBanner
          title="Upper Body Strength · Week 3"
          subtitle="4 exercises/day · Knee-safe substitutions applied"
        />

        <Button
          label="Edit and sign off this plan"
          variant="secondary"
          size="large"
          fullWidth
          onPress={handleEditPlan}
          style={styles.editButton}
        />

        <Text variant="h5" style={styles.sectionTitle}>
          Shared with you
        </Text>
        <View style={styles.rows}>
          {SHARED_ITEMS.map((item) => (
            <TrainerSharedItemRow key={item.id} item={item} onPress={handleSharedItemPress} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.s3,
    marginBottom: Spacing.s4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    marginBottom: Spacing.s3,
  },
  name: {
    marginBottom: 2,
  },
  subtitle: {
    marginBottom: Spacing.s5,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.s2,
    marginBottom: Spacing.s5,
  },
  editButton: {
    marginTop: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  sectionTitle: {
    marginBottom: Spacing.s3,
  },
  rows: {
    gap: Spacing.s3,
  },
});
