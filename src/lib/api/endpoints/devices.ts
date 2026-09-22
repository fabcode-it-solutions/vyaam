import { apiRequest } from '../client';

export function registerDevice(pushToken: string, platform: 'ios' | 'android') {
  return apiRequest<null>('/devices/register', { method: 'POST', body: { pushToken, platform } });
}

export function deregisterDevice(pushToken: string) {
  return apiRequest<null>(`/devices/${encodeURIComponent(pushToken)}`, { method: 'DELETE' });
}
