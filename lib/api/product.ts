import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface Product {
    _id?: string;
    name: string;
    price: number;
    imagePath: string;
    category: string;
    isFavorited?: boolean;
    trending?: boolean;
    isNewArrival?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await axiosInstance.get(API.PRODUCTS.LIST);
        return response?.data?.data || [];
    } catch (error: any) {
        console.error('[product] getProducts error', error?.response?.status, error?.response?.data || error.message || error);
        throw error;
    }
};

export const getProductById = async (id: string): Promise<Product> => {
    try {
        const response = await axiosInstance.get(API.PRODUCTS.DETAIL(id));
        return response?.data?.data;
    } catch (error: any) {
        console.error('[product] getProductById error', error?.response?.status, error?.response?.data || error.message || error);
        throw error;
    }
};

export const createProduct = async (data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
        const response = await axiosInstance.post(API.PRODUCTS.CREATE, data);
        return response?.data?.data;
    } catch (error: any) {
        console.error('[product] createProduct error', error?.response?.status, error?.response?.data || error.message || error);
        throw error;
    }
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
    try {
        const response = await axiosInstance.put(API.PRODUCTS.UPDATE(id), data);
        return response?.data?.data;
    } catch (error: any) {
        console.error('[product] updateProduct error', error?.response?.status, error?.response?.data || error.message || error);
        throw error;
    }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
    try {
        const response = await axiosInstance.delete(API.PRODUCTS.DELETE(id));
        return response?.data?.success ?? false;
    } catch (error: any) {
        console.error('[product] deleteProduct error', error?.response?.status, error?.response?.data || error.message || error);
        throw error;
    }
};
