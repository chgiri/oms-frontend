export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description: string | null;
  price: number;
}

// Shape returned by GET /products (our own custom pagination wrapper)
export interface PagedResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Shape returned by GET /products/search and /search/advanced (Spring Data's native Page<T>)
export interface SpringPage<T> {
  content: T[];
  number: number; // current page index, 0-based — equivalent to our pageNo
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// What the list component actually works with — same shape regardless of
// which endpoint served the data. This is the adapter target.
export interface ProductPage {
  content: Product[];
  pageIndex: number;
  pageSize: number;
  totalElements: number;
}
