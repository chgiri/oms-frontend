import type { components } from '../../shared/models/api-types';

export type Payment = components['schemas']['PaymentResponse'];
export type PaymentRequest = components['schemas']['PaymentRequest'];
export type PaymentStatus = Payment['status'];
export type PaymentMethod = Payment['method'];

// Mirrors PaymentServiceImpl.ALLOWED_TRANSITIONS exactly (verified in the actual
// code this time, not a doc comment — see the Orders lesson).
export const ALLOWED_PAYMENT_TRANSITIONS: Partial<Record<PaymentStatus, PaymentStatus[]>> = {
  PENDING: ['COMPLETED', 'FAILED'],
  COMPLETED: ['REFUNDED'],
};

// Mirrors PaymentServiceImpl.DELETABLE_STATUSES
export const DELETABLE_PAYMENT_STATUSES: PaymentStatus[] = ['PENDING', 'FAILED'];

export function isPaymentDeletable(status: PaymentStatus): boolean {
  return DELETABLE_PAYMENT_STATUSES.includes(status);
}
