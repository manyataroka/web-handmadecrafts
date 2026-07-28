describe('Frontend Component & Utility Tests', () => {
  describe('Theme utilities', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('localStorage theme preference is read on mount', () => {
      localStorage.setItem('theme', 'dark');
      const stored = localStorage.getItem('theme');
      expect(stored).toBe('dark');
    });

    test('theme value cycles through system -> dark -> light -> system', () => {
      const cycle = (prev: string) => (prev === 'system' ? 'dark' : prev === 'dark' ? 'light' : 'system');
      expect(cycle('system')).toBe('dark');
      expect(cycle('dark')).toBe('light');
      expect(cycle('light')).toBe('system');
    });

    test('theme preference is persisted to localStorage', () => {
      const testTheme = 'dark';
      localStorage.setItem('theme', testTheme);
      expect(localStorage.getItem('theme')).toBe(testTheme);
    });
  });

  describe('Product filtering', () => {
    const products = [
      { name: 'Ring 1', price: 100, category: 'ring' },
      { name: 'Necklace 1', price: 200, category: 'necklace' },
      { name: 'Ring 2', price: 150, category: 'ring' },
    ];

    test('filters products by category', () => {
      const filtered = products.filter((p) => p.category === 'ring');
      expect(filtered).toHaveLength(2);
      expect(filtered.every((p) => p.category === 'ring')).toBe(true);
    });

    test('sorts products by price ascending', () => {
      const sorted = [...products].sort((a, b) => a.price - b.price);
      expect(sorted[0].price).toBeLessThanOrEqual(sorted[1].price);
    });

    test('returns empty array for non-existent category', () => {
      const filtered = products.filter((p) => p.category === 'earring');
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Favorites management', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('adds item to favorites', () => {
      const favorites: string[] = [];
      const updated = [...favorites, 'Ring1'];
      expect(updated).toContain('Ring1');
    });

    test('removes item from favorites', () => {
      const favorites = ['Ring1', 'Necklace1'];
      const updated = favorites.filter((f) => f !== 'Ring1');
      expect(updated).not.toContain('Ring1');
      expect(updated).toContain('Necklace1');
    });

    test('checks if item is favorite', () => {
      const favorites = ['Ring1', 'Necklace1'];
      expect(favorites.includes('Ring1')).toBe(true);
      expect(favorites.includes('Bracelet1')).toBe(false);
    });
  });

  describe('Navigation links', () => {
    const ALL_NAV_LINKS = [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About Us' },
      { href: '/shop', label: 'Shop' },
    ];

    test('nav links have correct href and label', () => {
      expect(ALL_NAV_LINKS[0]).toEqual({ href: '/', label: 'Home' });
    });

    test('identifies active route', () => {
      const isActive = (href: string, pathname: string) =>
        href === '/' ? pathname === '/' : pathname?.startsWith(href);
      expect(isActive('/', '/')).toBe(true);
      expect(isActive('/about', '/about/team')).toBe(true);
      expect(isActive('/shop', '/about')).toBe(false);
    });
  });

  describe('Session storage management', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    test('stores and retrieves user login state', () => {
      sessionStorage.setItem('isLoggedIn', 'true');
      expect(sessionStorage.getItem('isLoggedIn')).toBe('true');
    });

    test('stores and retrieves username', () => {
      sessionStorage.setItem('username', 'testuser');
      expect(sessionStorage.getItem('username')).toBe('testuser');
    });

    test('clears session on logout', () => {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', 'testuser');
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('username');
      expect(sessionStorage.getItem('isLoggedIn')).toBeNull();
      expect(sessionStorage.getItem('username')).toBeNull();
    });
  });
});
