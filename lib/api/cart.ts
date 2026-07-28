import axiosInstance from "./axios-instance";
import { API } from "./endpoints";
import type { CartItem } from "../cart";

export const getCart = async (): Promise<CartItem[]> => {
    const response = await axiosInstance.get(API.CART.LIST);
    return response?.data?.data || [];
};

export const addCartItem = async (payload: {
    productId?: string;
    productName?: string;
    qty?: number;
}): Promise<CartItem[]> => {
    const response = await axiosInstance.post(API.CART.ADD_ITEM, payload);
    return response?.data?.data || [];
};

export const updateCartItemQty = async (
    productId: string,
    qty: number
): Promise<CartItem[]> => {
    const response = await axiosInstance.put(API.CART.UPDATE_ITEM(productId), { qty });
    return response?.data?.data || [];
};

export const removeCartItem = async (productId: string): Promise<CartItem[]> => {
    const response = await axiosInstance.delete(API.CART.REMOVE_ITEM(productId));
    return response?.data?.data || [];
};

export const clearCart = async (): Promise<CartItem[]> => {
    const response = await axiosInstance.delete(API.CART.CLEAR);
    return response?.data?.data || [];
};
