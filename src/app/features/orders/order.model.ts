import type { components } from '../../shared/models/api-types';

export type Order = components['schemas']['OrderResponse'];
export type OrderRequest = components['schemas']['OrderRequest'];
export type OrderItem = components['schemas']['OrderItemResponse'];
export type OrderItemRequest = components['schemas']['OrderItemRequest'];
export type OrderStatus = Order['status']; // inline enum, same indexed-access trick as CustomerStatus

// The full lifecycle, in order — used to render the timeline.
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'AWAITING_PAYMENT',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
];

// Mirrors the backend's manual-transition rules exactly (see OrderController's
// @Operation description on PATCH /orders/{id}/status). AWAITING_PAYMENT is
// saga-only — never a manual source or target — so it's absent as a key here.
export const ALLOWED_MANUAL_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ['CANCELLED'], // AWAITING_PAYMENT is normally saga-driven — see adminOnlyTransitions below
  AWAITING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
};

// Technically permitted by the backend's ALLOWED_TRANSITIONS map (same method the
// Kafka saga consumer calls), but conceptually a system-driven transition. Exposed
// only to ADMIN, as a manual recovery override for a stuck order — not routine use.
export const ADMIN_OVERRIDE_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ['AWAITING_PAYMENT'],
};

// Mirrors OrderServiceImpl's DELETABLE_STATUSES — once an order has moved past
// CANCELLED/PENDING, deleting it would lose the audit trail of a real transaction.
export const DELETABLE_STATUSES: OrderStatus[] = ['PENDING', 'CANCELLED'];

export function isOrderDeletable(status: OrderStatus): boolean {
  return DELETABLE_STATUSES.includes(status);
}
