import type { ActiveRole } from '@/store/useSessionStore';

import { apiRequest } from '../client';
import type { Gender } from './auth';

export type SwitchRoleResult = {
  activeRole: ActiveRole;
  verificationStarted: boolean;
  trainerVerificationStatus?: 'unverified' | 'pending' | 'approved' | 'rejected';
};

/**
 * POST /me/switch-role — used for Auth/Role Select too, not just the
 * Settings "Switch role" screen. /auth/role (POST) is documented for
 * first-time role selection but always 409s (see endpoints/auth.ts
 * setInitialRole) because every user is created with roles: ['customer']
 * already. This endpoint has no such bug and correctly starts trainer
 * verification on a first switch to 'trainer' rather than switching
 * immediately — activeRole stays 'customer' until approved.
 */
export function switchRole(role: 'customer' | 'trainer') {
  return apiRequest<SwitchRoleResult>('/me/switch-role', { method: 'POST', body: { role } });
}

export type MeProfile = {
  id: string;
  phone: string | null;
  email: string | null;
  fullName: string;
  bio?: string;
  gender?: Gender;
  avatarUrl?: string;
  language: 'en' | 'hi';
  roles: ActiveRole[];
  activeRole: ActiveRole;
  trainerVerificationStatus: 'unverified' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export function getMe() {
  return apiRequest<MeProfile>('/me');
}

export function updateMe(input: { name?: string; bio?: string; avatarUrl?: string; gender?: Gender }) {
  return apiRequest<MeProfile>('/me', { method: 'PATCH', body: input });
}

export type AccountSettings = {
  phone: string | null;
  email: string | null;
  twoFactorEnabled: boolean;
  connectedAccounts: { google: boolean; apple: boolean };
};

export function getAccountSettings() {
  return apiRequest<AccountSettings>('/me/account-settings');
}

/** idToken is a Firebase ID token freshly issued for the NEW phone number (see changePhoneSchema on the backend). */
export function changePhone(idToken: string) {
  return apiRequest<{ phone: string }>('/me/phone', { method: 'PATCH', body: { idToken } });
}

export function changeEmail(email: string) {
  return apiRequest<{ email: string }>('/me/email', { method: 'PATCH', body: { email } });
}

export function setTwoFactor(enabled: boolean) {
  return apiRequest<null>('/me/two-factor', { method: 'PATCH', body: { enabled } });
}

export function setLanguage(language: 'en' | 'hi') {
  return apiRequest<null>('/me/language', { method: 'PATCH', body: { language } });
}

export type NotificationSettings = {
  pushEnabled: boolean;
  bidsAndMessages: boolean;
  sessionReminders: boolean;
  communityActivity: boolean;
  offersAndPromotions: boolean;
};

export function getNotificationSettings() {
  return apiRequest<NotificationSettings>('/me/notification-settings');
}

export function updateNotificationSettings(input: Partial<NotificationSettings>) {
  return apiRequest<NotificationSettings>('/me/notification-settings', { method: 'PATCH', body: input });
}

export type VisibilityLevel = 'everyone' | 'trainers' | 'private';

export type PrivacySettings = {
  profileVisibility: VisibilityLevel;
  progressPhotosVisibility: VisibilityLevel;
  logsVisibility: VisibilityLevel;
  showOnLeaderboards: boolean;
};

export function getPrivacySettings() {
  return apiRequest<PrivacySettings>('/me/privacy-settings');
}

export function updatePrivacySettings(input: Partial<PrivacySettings>) {
  return apiRequest<PrivacySettings>('/me/privacy-settings', { method: 'PATCH', body: input });
}

export type BlockedUser = {
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  blockedAt: string;
};

export type Paginated<T> = {
  data: T[];
  pagination: { page: number; limit: number; totalItems: number; totalPages: number; hasMore: boolean };
};

export function listBlockedUsers(page = 1, limit = 20) {
  return apiRequest<Paginated<BlockedUser>>(`/me/blocked-users?page=${page}&limit=${limit}`);
}

export function blockUser(userId: string) {
  return apiRequest<null>('/me/blocked-users', { method: 'POST', body: { userId } });
}

export function unblockUser(userId: string) {
  return apiRequest<null>(`/me/blocked-users/${userId}`, { method: 'DELETE' });
}

export function requestAccountDeletion() {
  return apiRequest<{ deletionRequestedAt: string; purgeScheduledFor: string }>('/me/delete', {
    method: 'POST',
    body: { confirmationText: 'DELETE' },
  });
}

export function cancelAccountDeletion() {
  return apiRequest<null>('/me/delete/cancel', { method: 'POST' });
}
