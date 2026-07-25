import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    || "http://localhost:5001";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const setAuthToken = (token?: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
};

export default axiosInstance;

// Development debug interceptors
if (process.env.NODE_ENV !== 'production') {
    axiosInstance.interceptors.request.use((config) => {
        // eslint-disable-next-line no-console
        console.debug('[api] request', config.method, (config.baseURL || '') + (config.url || ''), config);
        return config;
    }, (err) => {
        // eslint-disable-next-line no-console
        console.error('[api] request error', err);
        return Promise.reject(err);
    });

    axiosInstance.interceptors.response.use((res) => {
        // eslint-disable-next-line no-console
        console.debug('[api] response', res.config.url, res.status, res.data);
        return res;
    }, (err) => {
        // eslint-disable-next-line no-console
        console.error(
            '[api] response error',
            {
                url: (err?.config?.baseURL || '') + (err?.config?.url || ''),
                status: err?.response?.status,
                data: err?.response?.data,
                code: err?.code,
                message: err?.message,
            }
        );
        return Promise.reject(err);
    });
}
