import type { components } from '../../shared/models/api-types';

export type Shipment = components['schemas']['ShipmentResponse'];
export type ShipmentRequest = components['schemas']['ShipmentRequest'];
export type ShipmentStatus = Shipment['status'];
export type ShippingCarrier = Shipment['carrier'];

// Verified against ShipmentServiceImpl.ALLOWED_TRANSITIONS directly.
export const ALLOWED_SHIPMENT_TRANSITIONS: Partial<Record<ShipmentStatus, ShipmentStatus[]>> = {
  PENDING: ['SHIPPED'],
  SHIPPED: ['IN_TRANSIT', 'RETURNED'],
  IN_TRANSIT: ['DELIVERED', 'RETURNED'],
};

// Verified against ShipmentServiceImpl.DELETABLE_STATUSES
export const DELETABLE_SHIPMENT_STATUSES: ShipmentStatus[] = ['PENDING', 'RETURNED'];

export function isShipmentDeletable(status: ShipmentStatus): boolean {
  return DELETABLE_SHIPMENT_STATUSES.includes(status);
}
