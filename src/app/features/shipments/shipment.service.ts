import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntityPage, PagedResponse, SpringPage } from '../../shared/models/pagination.model';
import { Shipment, ShipmentRequest, ShipmentStatus, ShippingCarrier } from './shipment.model';

export interface ShipmentSearchFilters {
  orderId?: number;
  status?: ShipmentStatus;
  carrier?: ShippingCarrier;
}

@Service()
export class ShipmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/shipments`;

  getAll(
    pageIndex: number,
    pageSize: number,
    sortBy = 'id',
    sortDir: 'asc' | 'desc' = 'desc',
  ): Observable<EntityPage<Shipment>> {
    const params = new HttpParams()
      .set('pageNo', pageIndex)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http
      .get<PagedResponse<Shipment>>(this.baseUrl, { params })
      .pipe(
        map((res) => ({
          content: res.content,
          pageIndex: res.pageNo,
          pageSize: res.pageSize,
          totalElements: res.totalElements,
        })),
      );
  }

  search(
    filters: ShipmentSearchFilters,
    pageIndex: number,
    pageSize: number,
  ): Observable<EntityPage<Shipment>> {
    let params = new HttpParams()
      .set('page', pageIndex)
      .set('size', pageSize)
      .set('sort', 'id,desc');

    if (filters.orderId != null) params = params.set('orderId', filters.orderId);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.carrier) params = params.set('carrier', filters.carrier);

    return this.http
      .get<SpringPage<Shipment>>(`${this.baseUrl}/search`, { params })
      .pipe(
        map((res) => ({
          content: res.content,
          pageIndex: res.number,
          pageSize: res.size,
          totalElements: res.totalElements,
        })),
      );
  }

  getById(id: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.baseUrl}/${id}`);
  }

  create(request: ShipmentRequest): Observable<Shipment> {
    return this.http.post<Shipment>(this.baseUrl, request);
  }

  updateStatus(id: number, status: ShipmentStatus, trackingNumber?: string): Observable<Shipment> {
    return this.http.patch<Shipment>(`${this.baseUrl}/${id}/status`, { status, trackingNumber });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
