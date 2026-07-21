import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResponse, Product, ProductPage, ProductRequest, SpringPage } from './product.model';

export interface ProductSearchFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Service()
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  getAll(
    pageIndex: number,
    pageSize: number,
    sortBy = 'id',
    sortDir: 'asc' | 'desc' = 'asc',
  ): Observable<ProductPage> {
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
  ): Observable<ProductPage> {
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
    return this.http.post<Product>(this.baseUrl, request);
  }

  update(id: number, request: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // --- adapters: normalize both backend pagination shapes into one ---

  private fromPagedResponse(res: PagedResponse<Product>): ProductPage {
    return {
      content: res.content,
      pageIndex: res.pageNo,
      pageSize: res.pageSize,
      totalElements: res.totalElements,
    };
  }

  private fromSpringPage(res: SpringPage<Product>): ProductPage {
    return {
      content: res.content,
      pageIndex: res.number,
      pageSize: res.size,
      totalElements: res.totalElements,
    };
  }
}
