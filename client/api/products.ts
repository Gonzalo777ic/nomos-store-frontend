import http from "./http";
import type { Product, PaginatedResponse } from "@/types";

export async function getProducts(params?: {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
}): Promise<PaginatedResponse<Product>> {
  const { page = 0, size = 12, search = "", category = "" } = params || {};
  const res = await http.get<PaginatedResponse<Product>>("/products", {
    params: { page, size, search: search || undefined, category: category || undefined },
  });
  return res.data;
}

export async function getProductById(id: string | number): Promise<Product> {
  const res = await http.get<Product>(`/products/${id}`);
  return res.data;
}
