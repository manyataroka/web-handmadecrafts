import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
    try{
        // eslint-disable-next-line no-console
        console.debug('[auth] register ->', API.AUTH.REGISTER, data);
        const response = await axiosInstance.post(API.AUTH.REGISTER, data);
        // eslint-disable-next-line no-console
        console.debug('[auth] register response', response.status, response.data);
        return response.data;
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error('[auth] register error', error?.response?.status, error?.response?.data || error.message || error);
        // Rethrow original error so callers can inspect `error.response`
        throw error;
    }
}

export const login = async (data: any) => {
    try {
        // eslint-disable-next-line no-console
        console.debug('[auth] login ->', API.AUTH.LOGIN, data);
        const response = await axiosInstance.post(API.AUTH.LOGIN, data);
        // eslint-disable-next-line no-console
        console.debug('[auth] login response', response.status, response.data);
        return response.data;
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error('[auth] login error', error?.response?.status, error?.response?.data || error.message || error);
        throw error;
    }
}

export const resetPassword = async (data: any) => {
    try {
        // eslint-disable-next-line no-console
        console.debug('[auth] resetPassword ->', API.AUTH.RESET_PASSWORD, data);
        const response = await axiosInstance.post(API.AUTH.RESET_PASSWORD, data);
        // eslint-disable-next-line no-console
        console.debug('[auth] resetPassword response', response.status, response.data);
        return response.data;
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error('[auth] resetPassword error', error?.response?.status, error?.response?.data || error.message || error);
        throw error;
    }
}
