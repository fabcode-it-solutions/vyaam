import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { SectionLabel } from '@/components/settings';
import { TrainerClientRow, type TrainerClient } from '@/components/trainer';
import { BackButton, Input, SearchIcon, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Trainer/Clients — every client with an active or past engagement. Clients
 * below are illustrative; needs the real clients endpoint rather than a
 * static list filtered by name client-side.
 */
const ACTIVE_CLIENTS: TrainerClient[] = [
  { id: 'client-1', name: 'Priya Sharma', subtitle: 'Upper body strength · Session 3 of 4' },
  { id: 'client-2', name: 'Karan Mehta', subtitle: 'Weekend gym partner · Session 1 of 8' },
  { id: 'client-3', name: 'Divya Nair', subtitle: 'Beginner yoga · Session 5 of 8', nextLabel: 'Next: Mon 6 AM' },
];

const PAST_CLIENTS: TrainerClient[] = [
  { id: 'client-4', name: 'Sanjay Rao', subtitle: '10K running prep · Completed', active: false },
];

export default function TrainerClientListScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  const matches = useCallback(
    (client: TrainerClient) => client.name.toLowerCase().includes(query.trim().toLowerCase()),
    [query],
  );
  const activeClients = useMemo(() => ACTIVE_CLIENTS.filter(matches), [matches]);
  const pastClients = useMemo(() => PAST_CLIENTS.filter(matches), [matches]);

  const handleClientPress = useCallback(
    (client: TrainerClient) => router.push({ pathname: '/trainer/client-detail', params: { id: client.id } }),
    [],
  );

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Clients</Text>
        </View>

        <Input
          hideLabel
          label="Search clients"
          value={query}
          onChangeText={setQuery}
          placeholder="Search clients..."
          leadingIcon={<SearchIcon size={20} color={colors.textMuted} />}
        />

        <SectionLabel label={`Active (${activeClients.length})`} />
        <View style={styles.rows}>
          {activeClients.map((client) => (
            <TrainerClientRow key={client.id} client={client} onPress={handleClientPress} />
          ))}
        </View>

        {pastClients.length > 0 && (
          <>
            <SectionLabel label={`Past (${pastClients.length})`} />
            <View style={styles.rows}>
              {pastClients.map((client) => (
                <TrainerClientRow key={client.id} client={client} onPress={handleClientPress} />
              ))}
            </View>
          </>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  rows: {
    gap: Spacing.s3,
  },
});
