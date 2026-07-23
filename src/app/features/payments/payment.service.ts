import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntityPage, PagedResponse, SpringPage } from '../../shared/models/pagination.model';
import { Payment, PaymentMethod, PaymentRequest, PaymentStatus } from './payment.model';

export interface PaymentSearchFilters {
  orderId?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
}

@Service()
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/payments`;

  getAll(
    pageIndex: number,
    pageSize: number,
    sortBy = 'id',
    sortDir: 'asc' | 'desc' = 'desc',
  ): Observable<EntityPage<Payment>> {
    const params = new HttpParams()
      .set('pageNo', pageIndex)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PagedResponse<Payment>>(this.baseUrl, { params }).pipe(
      map((res) => ({
        content: res.content,
        pageIndex: res.pageNo,
        pageSize: res.pageSize,
        totalElements: res.totalElements,
      })),
    );
  }

  search(
    filters: PaymentSearchFilters,
    pageIndex: number,
    pageSize: number,
  ): Observable<EntityPage<Payment>> {
    let params = new HttpParams()
      .set('page', pageIndex)
      .set('size', pageSize)
      .set('sort', 'id,desc');

    if (filters.orderId != null) params = params.set('orderId', filters.orderId);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.method) params = params.set('method', filters.method);
    if (filters.minAmount != null) params = params.set('minAmount', filters.minAmount);
    if (filters.maxAmount != null) params = params.set('maxAmount', filters.maxAmount);

    return this.http.get<SpringPage<Payment>>(`${this.baseUrl}/search`, { params }).pipe(
      map((res) => ({
        content: res.content,
        pageIndex: res.number,
        pageSize: res.size,
        totalElements: res.totalElements,
      })),
    );
  }

  getById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}`);
  }

  create(request: PaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, request);
  }

  updateStatus(
    id: number,
    status: PaymentStatus,
    transactionReference?: string,
  ): Observable<Payment> {
    return this.http.patch<Payment>(`${this.baseUrl}/${id}/status`, {
      status,
      transactionReference,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
