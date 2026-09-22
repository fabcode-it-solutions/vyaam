import { apiRequest } from '../client';
import type { Paginated } from './me';

export type HelpArticleSummary = {
  id: string;
  title: string;
  category?: string;
};

export type HelpArticle = HelpArticleSummary & {
  body: string;
};

export function searchHelpArticles(query?: string, page = 1, limit = 20) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (query) params.set('query', query);
  return apiRequest<Paginated<HelpArticleSummary>>(`/help/articles?${params.toString()}`, { auth: false });
}

export function getHelpArticle(id: string) {
  return apiRequest<HelpArticle>(`/help/articles/${id}`, { auth: false });
}
