import axios from "axios";
import type { PaginatedResponse, Product } from "@/types";

const catalog = axios.create({
  baseURL: (import.meta as any).env?.VITE_CATALOG_API_URL || "http://localhost:8082/api/catalog",
});

export async function getProducts(params?: {
  page?: number;
  size?: number;
  search?: string;
}): Promise<PaginatedResponse<Product>> {
  const { page = 0, size = 12, search = "" } = params || {};
  const res = await catalog.get<PaginatedResponse<Product>>("/products", {
    params: { page, size, search: search || undefined },
  });
  return res.data;
}

export async function getProductById(id: string | number): Promise<Product> {
  const res = await catalog.get<Product>(`/products/${id}`);
  return res.data;
}
