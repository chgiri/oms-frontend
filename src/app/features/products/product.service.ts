import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductRequest } from './product.model';
import { EntityPage, PagedResponse, SpringPage } from '../../shared/models/pagination.model';

export interface ProductSearchFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Service()
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;
  private pickerCache$: Observable<Product[]> | null = null;

  // Cached, shared list for dropdowns/pickers (Inventory form, Order form, etc.).
  // Multiple components calling this in the same session share one HTTP request.
  getAllForPicker(): Observable<Product[]> {
    if (!this.pickerCache$) {
      this.pickerCache$ = this.getAll(0, 100).pipe(
        map((page) => page.content),
        shareReplay(1),
      );
    }
    return this.pickerCache$;
  }

  private invalidatePickerCache(): void {
    this.pickerCache$ = null;
  }

  getAll(
    pageIndex: number,
    pageSize: number,
    sortBy = 'id',
    sortDir: 'asc' | 'desc' = 'asc',
  ): Observable<EntityPage<Product>> {
    const params = new HttpParams()
      .set('pageNo', pageIndex)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http
      .get<PagedResponse<Product>>(this.baseUrl, { params })
      .pipe(map((res) => this.fromPagedResponse(res)));
  }

  search(
    filters: ProductSearchFilters,
    pageIndex: number,
    pageSize: number,
  ): Observable<EntityPage<Product>> {
    let params = new HttpParams()
      .set('page', pageIndex)
      .set('size', pageSize)
      .set('sort', 'name,asc');

    if (filters.name) params = params.set('name', filters.name);
    if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice);

    return this.http
      .get<SpringPage<Product>>(`${this.baseUrl}/search`, { params })
      .pipe(map((res) => this.fromSpringPage(res)));
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(request: ProductRequest): Observable<Product> {
    return this.http
      .post<Product>(this.baseUrl, request)
      .pipe(tap(() => this.invalidatePickerCache()));
  }

  update(id: number, request: ProductRequest): Observable<Product> {
    return this.http
      .put<Product>(`${this.baseUrl}/${id}`, request)
      .pipe(tap(() => this.invalidatePickerCache()));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(tap(() => this.invalidatePickerCache()));
  }

  // --- adapters: normalize both backend pagination shapes into one ---

  private fromPagedResponse(res: PagedResponse<Product>): EntityPage<Product> {
    return {
      content: res.content,
      pageIndex: res.pageNo,
      pageSize: res.pageSize,
      totalElements: res.totalElements,
    };
  }

  private fromSpringPage(res: SpringPage<Product>): EntityPage<Product> {
    return {
      content: res.content,
      pageIndex: res.number,
      pageSize: res.size,
      totalElements: res.totalElements,
    };
  }
}
