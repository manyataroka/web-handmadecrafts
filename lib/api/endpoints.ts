export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        FORGOT_PASSWORD: "/api/auth/forgot-password",
        RESET_PASSWORD: "/api/auth/reset-password",
    },
    PRODUCTS: {
        LIST: "/api/products",
        DETAIL: (id: string) => `/api/products/${id}`,
        CREATE: "/api/products",
        UPDATE: (id: string) => `/api/products/${id}`,
        DELETE: (id: string) => `/api/products/${id}`,
    },
    CART: {
        LIST: "/api/cart",
        ADD_ITEM: "/api/cart/items",
        UPDATE_ITEM: (productId: string) => `/api/cart/items/${productId}`,
        REMOVE_ITEM: (productId: string) => `/api/cart/items/${productId}`,
        CLEAR: "/api/cart",
    },
    ORDERS: {
        CREATE: "/api/orders",
        LIST: "/api/orders",
    },
};
