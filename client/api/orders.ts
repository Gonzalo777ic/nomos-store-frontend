import http from "./http";
import type { Order, CreateOrderInput } from "@/types";

export async function getOrders(): Promise<Order[]> {
  const res = await http.get<Order[]>("/orders");
  return res.data;
}

export async function createOrder(data: CreateOrderInput): Promise<Order> {
  const res = await http.post<Order>("/orders", data);
  return res.data;
}
