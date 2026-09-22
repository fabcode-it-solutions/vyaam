import { apiRequest } from '../client';

export type SupportTicketCategory = 'bug' | 'payment' | 'trainer_conduct' | 'other';

export function createSupportTicket(input: {
  category: SupportTicketCategory;
  description: string;
  attachmentUrl?: string;
}) {
  return apiRequest<{ id: string; status: string }>('/support/tickets', { method: 'POST', body: input });
}
