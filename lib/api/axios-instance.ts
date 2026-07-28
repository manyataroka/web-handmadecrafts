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
        console.debug('[api] request', config.method, (config.baseURL || '') + (config.url || ''));
        return config;
    }, (err) => {
        // eslint-disable-next-line no-console
        console.error('[api] request error ->',
            '\n  message:', err?.message,
            '\n  code:   ', err?.code,
            '\n  name:   ', err?.name,
            err
        );
        return Promise.reject(err);
    });

    axiosInstance.interceptors.response.use((res) => {
        // eslint-disable-next-line no-console
        console.debug('[api] response', res.config.url, res.status);
        return res;
    }, (err) => {
        const url = (err?.config?.baseURL || '') + (err?.config?.url || '');
        const status = err?.response?.status;
        const data = err?.response?.data;
        // eslint-disable-next-line no-console
        console.error('[api] response error ->',
            '\n  url:    ', url,
            '\n  status: ', status,
            '\n  code:   ', err?.code,
            '\n  message:', err?.message,
            '\n  data:   ', typeof data === 'object' ? JSON.stringify(data) : data,
            '\n  stack:  ', err?.stack?.split('\n')[0],
        );
        return Promise.reject(err);
    });
}
