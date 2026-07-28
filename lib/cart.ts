import { addCartItem, getCart as fetchCartFromApi, removeCartItem as removeCartItemApi, updateCartItemQty as updateCartItemQtyApi } from "./api/cart";

export type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string;
    qty: number;
};

export const CART_STORAGE_KEY = 'cart:items';

export function isUserLoggedIn(): boolean {
    try {
        const value = sessionStorage.getItem('isLoggedIn');
        return value === 'true' || value === '1';
    } catch (_) {
        return false;
    }
}

export function productToCartId(name: string, id?: string): string {
    if (id) return id;
    return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function getCartItems(): CartItem[] {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as CartItem[];
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (_) {}
    return [];
}

function persistLocal(items: CartItem[]) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function persistLocalAndNotify(items: CartItem[]) {
    persistLocal(items);
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: items }));
}

export async function loadCart(): Promise<CartItem[]> {
    if (!isUserLoggedIn()) {
        return getCartItems();
    }

    try {
        const items = await fetchCartFromApi();
        persistLocal(items); // quiet persist — no cart-updated event for read/sync operations
        return items;
    } catch (_) {
        return getCartItems();
    }
}

export async function addToCart(product: {
    _id?: string;
    name: string;
    price: number;
    imagePath: string;
}): Promise<CartItem[]> {
    if (isUserLoggedIn()) {
        try {
            const items = await addCartItem({
                productId: product._id,
                productName: product._id ? undefined : product.name,
                qty: 1,
            });
            persistLocalAndNotify(items);
            return items;
        } catch (error) {
            console.error('[cart] addToCart API error', error);
            throw error;
        }
    }

    const id = productToCartId(product.name, product._id);
    const items = getCartItems();
    const existing = items.find((item) => item.id === id);

    let next: CartItem[];
    if (existing) {
        next = items.map((item) =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
    } else {
        next = [
            ...items,
            {
                id,
                name: product.name,
                price: product.price,
                image: product.imagePath,
                qty: 1,
            },
        ];
    }

    persistLocalAndNotify(next);
    return next;
}

export function getCartCount(items: CartItem[] = getCartItems()): number {
    return items.reduce((sum, item) => sum + item.qty, 0);
}

export async function updateCartQty(productId: string, qty: number): Promise<CartItem[]> {
    if (isUserLoggedIn()) {
        const items = await updateCartItemQtyApi(productId, qty);
        persistLocalAndNotify(items);
        return items;
    }

    const next = getCartItems().map((item) =>
        item.id === productId ? { ...item, qty: Math.max(1, qty) } : item
    );
    persistLocalAndNotify(next);
    return next;
}

export async function removeFromCart(productId: string): Promise<CartItem[]> {
    if (isUserLoggedIn()) {
        const items = await removeCartItemApi(productId);
        persistLocalAndNotify(items);
        return items;
    }

    const next = getCartItems().filter((item) => item.id !== productId);
    persistLocalAndNotify(next);
    return next;
}

export async function clearCart(): Promise<CartItem[]> {
    if (isUserLoggedIn()) {
        try {
            const { clearCart: clearCartApi } = await import('./api/cart');
            const items = await clearCartApi();
            persistLocalAndNotify(items);
            return items;
        } catch (_) {
            persistLocalAndNotify([]);
            return [];
        }
    }
    persistLocalAndNotify([]);
    return [];
}
