export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: Product["id"];
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string | number;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface Credentials { email: string; password: string }
export interface RegisterInput { name: string; email: string; password: string }
export interface AuthResponse { token: string; user: User }

export interface CreateOrderInput {
  items: { productId: Product["id"]; quantity: number }[];
}
