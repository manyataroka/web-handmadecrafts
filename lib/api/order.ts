import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

export interface OrderLineItem {
    productId?: string;
    name: string;
    price: number;
    image: string;
    qty: number;
}

export interface OrderUserInfo {
    id: string;
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

export interface Order {
    id: string;
    date: string;
    total: number;
    items: number;
    address: string;
    payment: string;
    status: OrderStatus;
    notes?: string;
    phone: string;
    subtotal: number;
    shipping: number;
    lineItems: OrderLineItem[];
    user?: OrderUserInfo;
}

export interface CreateOrderInput {
    address: string;
    phone: string;
    paymentMethod?: string;
    notes?: string;
}

export const createOrder = async (payload: CreateOrderInput): Promise<Order> => {
    const response = await axiosInstance.post(API.ORDERS.CREATE, payload);
    return response?.data?.data as Order;
};

export const listOrders = async (): Promise<Order[]> => {
    const response = await axiosInstance.get(API.ORDERS.LIST);
    return (response?.data?.data || []) as Order[];
};
