// Our own custom pagination wrapper — used by plain GET list endpoints (e.g. GET /products, GET /customers)
export interface PagedResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Spring Data's native Page<T> shape — used by /search and /search/advanced endpoints
export interface SpringPage<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// What list components actually work with — one normalized shape regardless of source endpoint
export interface EntityPage<T> {
  content: T[];
  pageIndex: number;
  pageSize: number;
  totalElements: number;
}
