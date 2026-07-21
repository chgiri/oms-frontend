import type { components } from '../../shared/models/api-types';

export type Customer = components['schemas']['CustomerResponse'];
export type CustomerRequest = components['schemas']['CustomerRequest'];
export type CustomerStatus = CustomerRequest['status'];
