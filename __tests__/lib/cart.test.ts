jest.mock('../../lib/api/cart', () => ({
  addCartItem: jest.fn().mockResolvedValue([{ id: 'api-1', name: 'API', price: 1, image: '', qty: 1 }]),
  getCart: jest.fn().mockResolvedValue([{ id: 'api-2', name: 'API2', price: 2, image: '', qty: 3 }]),
  updateCartItemQty: jest.fn().mockResolvedValue([{ id: 'api-2', name: 'API2', price: 2, image: '', qty: 2 }]),
  removeCartItem: jest.fn().mockResolvedValue([]),
  clearCart: jest.fn().mockResolvedValue([]),
}));

import {
  CART_STORAGE_KEY,
  isUserLoggedIn,
  productToCartId,
  getCartItems,
  addToCart,
  getCartCount,
  updateCartQty,
  removeFromCart,
  clearCart,
  loadCart,
} from '../../lib/cart';

beforeEach(() => {
  // clear storages between tests
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
});

describe('cart utility (guest flows)', () => {
  test('isUserLoggedIn reads sessionStorage', () => {
    expect(isUserLoggedIn()).toBe(false);
    sessionStorage.setItem('isLoggedIn', 'true');
    expect(isUserLoggedIn()).toBe(true);
    sessionStorage.setItem('isLoggedIn', '1');
    expect(isUserLoggedIn()).toBe(true);
    sessionStorage.setItem('isLoggedIn', '0');
    expect(isUserLoggedIn()).toBe(false);
  });

  test('productToCartId creates slug', () => {
    expect(productToCartId('My Product Name')).toBe('my-product-name');
    expect(productToCartId('  Something! New  ')).toBe('something-new');
    expect(productToCartId('Name', 'explicit-id')).toBe('explicit-id');
  });

  test('getCartItems returns parsed array or empty', () => {
    expect(getCartItems()).toEqual([]);
    const items = [{ id: 'a', name: 'x', price: 1, image: '', qty: 2 }];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    expect(getCartItems()).toEqual(items);
  });

  test('addToCart adds item for guest and increments existing', async () => {
    const p = { name: 'Widget', price: 10, imagePath: '/img.png' };
    const items1 = await addToCart(p as any);
    expect(items1).toHaveLength(1);
    expect(items1[0].id).toBe('widget');
    expect(items1[0].qty).toBe(1);

    // add again should increment qty
    const items2 = await addToCart(p as any);
    expect(items2).toHaveLength(1);
    expect(items2[0].qty).toBe(2);
  });

  test('getCartCount sums quantities', async () => {
    const p = { name: 'Item', price: 1, imagePath: '/i.png' };
    await addToCart(p as any);
    await addToCart(p as any);
    const items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(getCartCount(items)).toBe(2);
  });

  test('updateCartQty enforces min qty and persists', async () => {
    const p = { name: 'Thing', price: 5, imagePath: '/t.png' };
    const items = await addToCart(p as any); // qty 1
    const id = items[0].id;
    // set to 3
    const updated = await updateCartQty(id, 3);
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored[0].qty).toBe(3);
    // set to 0 should clamp to 1
    const updated2 = await updateCartQty(id, 0);
    const stored2 = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored2[0].qty).toBe(1);
  });

  test('removeFromCart removes item', async () => {
    const p = { name: 'Removable', price: 2, imagePath: '/r.png' };
    const items = await addToCart(p as any);
    const id = items[0].id;
    const after = await removeFromCart(id);
    expect(after.find((it) => it.id === id)).toBeUndefined();
  });

  test('clearCart empties storage', async () => {
    const p = { name: 'C1', price: 1, imagePath: '/c1.png' };
    await addToCart(p as any);
    const cleared = await clearCart();
    expect(cleared).toEqual([]);
    expect(getCartItems()).toEqual([]);
  });

  test('loadCart returns local items when not logged in', async () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{ id: 'a', name: 'x', price: 1, image: '', qty: 4 }]));
    const loaded = await loadCart();
    expect(loaded).toEqual([{ id: 'a', name: 'x', price: 1, image: '', qty: 4 }]);
  });

  test('API-backed flows when logged in use API functions', async () => {
    // simulate logged in
    sessionStorage.setItem('isLoggedIn', 'true');

    // loadCart should return API data
    const loaded = await loadCart();
    expect(loaded).toEqual([{ id: 'api-2', name: 'API2', price: 2, image: '', qty: 3 }]);

    // addToCart when logged in should call API mock and return API items
    const added = await addToCart({ _id: 'p1', name: 'X', price: 1, imagePath: '' } as any);
    expect(added).toEqual([{ id: 'api-1', name: 'API', price: 1, image: '', qty: 1 }]);

    // updateCartQty when logged in should use API mock
    const updated = await updateCartQty('api-2', 2);
    expect(updated).toEqual([{ id: 'api-2', name: 'API2', price: 2, image: '', qty: 2 }]);

    // removeFromCart when logged in
    const afterRemove = await removeFromCart('api-2');
    expect(afterRemove).toEqual([]);

    // clearCart when logged in
    const cleared = await clearCart();
    expect(cleared).toEqual([]);
  });
});
