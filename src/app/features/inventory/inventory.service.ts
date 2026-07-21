import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EntityPage, PagedResponse, SpringPage } from '../../shared/models/pagination.model';
import { Inventory, InventoryRequest } from './inventory.model';

export interface InventorySearchFilters {
  productId?: number;
  location?: string;
  lowStockOnly?: boolean;
}

@Service()
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/inventory`;

  getAll(
    pageIndex: number,
    pageSize: number,
    sortBy = 'id',
    sortDir: 'asc' | 'desc' = 'asc',
  ): Observable<EntityPage<Inventory>> {
    const params = new HttpParams()
      .set('pageNo', pageIndex)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http
      .get<PagedResponse<Inventory>>(this.baseUrl, { params })
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
    filters: InventorySearchFilters,
    pageIndex: number,
    pageSize: number,
  ): Observable<EntityPage<Inventory>> {
    let params = new HttpParams()
      .set('page', pageIndex)
      .set('size', pageSize)
      .set('sort', 'id,asc')
      .set('lowStockOnly', !!filters.lowStockOnly);

    if (filters.productId != null) params = params.set('productId', filters.productId);
    if (filters.location) params = params.set('location', filters.location);

    return this.http
      .get<SpringPage<Inventory>>(`${this.baseUrl}/search`, { params })
      .pipe(
        map((res) => ({
          content: res.content,
          pageIndex: res.number,
          pageSize: res.size,
          totalElements: res.totalElements,
        })),
      );
  }

  getById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.baseUrl}/${id}`);
  }

  create(request: InventoryRequest): Observable<Inventory> {
    return this.http.post<Inventory>(this.baseUrl, request);
  }

  update(id: number, request: InventoryRequest): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
