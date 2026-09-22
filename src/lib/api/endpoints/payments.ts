import { apiRequest } from '../client';

export type PaymentMethod = {
  id: string;
  cardLast4: string;
  cardBrand?: string;
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
  isDefault: boolean;
};

export function listPaymentMethods() {
  return apiRequest<PaymentMethod[]>('/me/payment-methods');
}

/**
 * gatewayToken is a Razorpay card token id already saved against this customer
 * via Razorpay Checkout on the client (save=1) — card data itself never
 * touches our server. There's no Razorpay Checkout SDK wired into the app
 * yet, so nothing calls this today; it's here for when that's added.
 */
export function addPaymentMethod(gatewayToken: string) {
  return apiRequest<Pick<PaymentMethod, 'id' | 'cardLast4' | 'cardBrand' | 'isDefault'>>('/me/payment-methods', {
    method: 'POST',
    body: { gatewayToken },
  });
}

export function setDefaultPaymentMethod(id: string) {
  return apiRequest<null>(`/me/payment-methods/${id}/default`, { method: 'PATCH' });
}

export function removePaymentMethod(id: string) {
  return apiRequest<null>(`/me/payment-methods/${id}`, { method: 'DELETE' });
}
