import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntityPage, PagedResponse, SpringPage } from '../../shared/models/pagination.model';
import { Order, OrderRequest, OrderStatus } from './order.model';

export interface OrderSearchFilters {
  customerId?: number;
  status?: OrderStatus;
  minTotal?: number;
  maxTotal?: number;
}

@Service()
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  getAll(
    pageIndex: number,
    pageSize: number,
    sortBy = 'id',
    sortDir: 'asc' | 'desc' = 'desc',
  ): Observable<EntityPage<Order>> {
    const params = new HttpParams()
      .set('pageNo', pageIndex)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PagedResponse<Order>>(this.baseUrl, { params }).pipe(
      map((res) => ({
        content: res.content,
        pageIndex: res.pageNo,
        pageSize: res.pageSize,
        totalElements: res.totalElements,
      })),
    );
  }

  search(
    filters: OrderSearchFilters,
    pageIndex: number,
    pageSize: number,
  ): Observable<EntityPage<Order>> {
    let params = new HttpParams()
      .set('page', pageIndex)
      .set('size', pageSize)
      .set('sort', 'id,desc');

    if (filters.customerId != null) params = params.set('customerId', filters.customerId);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.minTotal != null) params = params.set('minTotal', filters.minTotal);
    if (filters.maxTotal != null) params = params.set('maxTotal', filters.maxTotal);

    return this.http.get<SpringPage<Order>>(`${this.baseUrl}/search`, { params }).pipe(
      map((res) => ({
        content: res.content,
        pageIndex: res.number,
        pageSize: res.size,
        totalElements: res.totalElements,
      })),
    );
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  create(request: OrderRequest): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, request);
  }

  updateStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
