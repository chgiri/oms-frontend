import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntityPage, PagedResponse, SpringPage } from '../../shared/models/pagination.model';
import { Customer, CustomerRequest, CustomerStatus } from './customer.model';

export interface CustomerSearchFilters {
  name?: string;
  email?: string;
  status?: CustomerStatus;
}

@Service()
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  getAll(
    pageIndex: number,
    pageSize: number,
    sortBy = 'id',
    sortDir: 'asc' | 'desc' = 'asc',
  ): Observable<EntityPage<Customer>> {
    const params = new HttpParams()
      .set('pageNo', pageIndex)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PagedResponse<Customer>>(this.baseUrl, { params }).pipe(
      map((res) => ({
        content: res.content,
        pageIndex: res.pageNo,
        pageSize: res.pageSize,
        totalElements: res.totalElements,
      })),
    );
  }

  search(
    filters: CustomerSearchFilters,
    pageIndex: number,
    pageSize: number,
  ): Observable<EntityPage<Customer>> {
    let params = new HttpParams()
      .set('page', pageIndex)
      .set('size', pageSize)
      .set('sort', 'firstName,asc');

    if (filters.name) params = params.set('name', filters.name);
    if (filters.email) params = params.set('email', filters.email);
    if (filters.status) params = params.set('status', filters.status);

    return this.http.get<SpringPage<Customer>>(`${this.baseUrl}/search`, { params }).pipe(
      map((res) => ({
        content: res.content,
        pageIndex: res.number,
        pageSize: res.size,
        totalElements: res.totalElements,
      })),
    );
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  create(request: CustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, request);
  }

  update(id: number, request: CustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
