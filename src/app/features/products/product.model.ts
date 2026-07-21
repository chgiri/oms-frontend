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
