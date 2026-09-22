import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Text } from '@/components/ui';
import { getHelpArticle, type HelpArticle } from '@/lib/api/endpoints/help';
import { Spacing, useTheme } from '@/theme';

/** Help article detail — reads a single article from GET /help/articles/:id. */
export default function HelpArticleScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ articleId: string }>();
  const articleId = Array.isArray(params.articleId) ? params.articleId[0] : params.articleId;
  const [article, setArticle] = useState<HelpArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await getHelpArticle(articleId);
        if (!cancelled) setArticle(result);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
        </View>

        {loading ? (
          <ActivityIndicator color={colors.textMuted} style={styles.loading} />
        ) : failed || !article ? (
          <Text variant="bodySecondary" color="textMuted">
            Couldn’t load this article. Try again later.
          </Text>
        ) : (
          <>
            <Text variant="h2" style={styles.title}>
              {article.title}
            </Text>
            <Text variant="bodySecondary" color="textSecondary">
              {article.body}
            </Text>
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
    paddingHorizontal: Spacing.s6,
    paddingBottom: Spacing.s8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  loading: {
    marginTop: Spacing.s8,
  },
  title: {
    marginBottom: Spacing.s4,
  },
});
