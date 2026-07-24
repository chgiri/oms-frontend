import type { components } from '../../shared/models/api-types';
import { TransitionMap } from '../../shared/models/status-workflow.model';

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

export const ALLOWED_MANUAL_TRANSITIONS: TransitionMap<OrderStatus> = {
  PENDING: ['CANCELLED'],
  AWAITING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
};

export const ADMIN_OVERRIDE_TRANSITIONS: TransitionMap<OrderStatus> = {
  PENDING: ['AWAITING_PAYMENT'],
};

export const DELETABLE_STATUSES: OrderStatus[] = ['PENDING', 'CANCELLED'];
