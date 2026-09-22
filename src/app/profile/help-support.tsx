import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { SectionLabel } from '@/components/settings';
import {
  BackButton,
  Card,
  ChatBubbleIcon,
  ChevronIcon,
  Input,
  MailIcon,
  SearchIcon,
  Text,
} from '@/components/ui';
import { searchHelpArticles, type HelpArticleSummary } from '@/lib/api/endpoints/help';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Help & support — Figma "Profile/Help & support" screen. The search box and
 * article list are wired to the real GET /help/articles (Style A
 * pagination, first page only here). There's no seed content in the backend
 * yet (no admin/seed route exists), so an empty result is expected until
 * articles are added — shown as a real empty state rather than static FAQs.
 * "Email us" opens the device mail client; "Chat with support" stays
 * comingSoon since there's no chat infrastructure yet.
 */

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

const CONTACT_OPTIONS = [
  {
    key: 'chat',
    icon: ChatBubbleIcon,
    title: 'Chat with support',
    subtitle: 'Typically replies in a few minutes',
    onPress: () => comingSoon('Chat with support'),
  },
  {
    key: 'email',
    icon: MailIcon,
    title: 'Email us',
    subtitle: 'support@vyaam.app',
    onPress: () => Linking.openURL('mailto:support@vyaam.app'),
  },
] as const;

export default function HelpSupportScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<HelpArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await searchHelpArticles(query.trim() || undefined);
        if (!cancelled) setArticles(result?.data ?? []);
      } catch {
        if (!cancelled) setArticles([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query]);

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Help & support</Text>
        </View>

        <Input
          hideLabel
          label="Search help articles"
          value={query}
          onChangeText={setQuery}
          placeholder="Search help articles..."
          leadingIcon={<SearchIcon size={20} color={colors.textMuted} />}
          returnKeyType="search"
        />

        <SectionLabel label="Common questions" />
        {loading ? (
          <ActivityIndicator color={colors.textMuted} style={styles.loading} />
        ) : articles.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text variant="caption" color="textMuted" style={styles.emptyText}>
              {query.trim() ? 'No articles match your search.' : 'No help articles yet — check back soon.'}
            </Text>
          </Card>
        ) : (
          <Card padded={false} style={styles.sectionCard}>
            {articles.map((article, index) => (
              <Pressable
                key={article.id}
                accessibilityRole="button"
                accessibilityLabel={article.title}
                onPress={() =>
                  router.push({ pathname: '/profile/help-article/[articleId]', params: { articleId: article.id } })
                }
                style={[styles.faqRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
                <Text variant="h5" style={styles.faqLabel}>
                  {article.title}
                </Text>
                <ChevronIcon size={16} color={colors.textMuted} />
              </Pressable>
            ))}
          </Card>
        )}

        <SectionLabel label="Contact us" />
        <Card padded={false} style={styles.sectionCard}>
          {CONTACT_OPTIONS.map(({ key, icon: Icon, title, subtitle, onPress }, index) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={title}
              onPress={onPress}
              style={[styles.contactRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <View style={[styles.contactIcon, { backgroundColor: colors.border }]}>
                <Icon size={18} color={colors.textPrimary} />
              </View>
              <View style={styles.contactText}>
                <Text variant="h5">{title}</Text>
                <Text variant="caption" color="textMuted">
                  {subtitle}
                </Text>
              </View>
              <ChevronIcon size={16} color={colors.textMuted} />
            </Pressable>
          ))}
        </Card>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  loading: {
    marginVertical: Spacing.s5,
  },
  sectionCard: {
    overflow: 'hidden',
  },
  emptyCard: {
    paddingVertical: Spacing.s6,
  },
  emptyText: {
    textAlign: 'center',
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
  faqLabel: {
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    flex: 1,
    gap: 2,
  },
});
