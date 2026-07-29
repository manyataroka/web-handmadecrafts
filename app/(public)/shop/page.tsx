'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
    Product,
    getProducts,
} from '../../../lib/api/product';
import ProductDetailModal from '../_components/ProductDetailModal';

interface LocalProduct {
    name: string;
    price: number;
    imagePath: string;
    category: string;
    trending?: boolean;
    isNewArrival?: boolean;
}

const HARDCODED_PRODUCTS: LocalProduct[] = [
    { name: 'Beads Necklace', price: 400, imagePath: '/images/img2.jpg', category: 'necklace', trending: true },
    { name: 'Round Chain', price: 325, imagePath: '/images/img13.jpg', category: 'necklace', trending: true },
    { name: 'Beads Pearl Bracelet', price: 450, imagePath: '/images/img5.jpg', category: 'bracelet', isNewArrival: true },
    { name: 'Adjustable Bracelet', price: 499, imagePath: '/images/img6.jpg', category: 'bracelet' },
    { name: 'Silver Ring', price: 999, imagePath: '/images/img7.jpg', category: 'ring', trending: true },
    { name: 'Panchadhatu Ring', price: 1099, imagePath: '/images/img8.jpg', category: 'ring', isNewArrival: true },
    { name: 'Adjustable Silver Ring', price: 999, imagePath: '/images/img9.jpg', category: 'ring' },
    { name: 'Pearl Bracelet', price: 599, imagePath: '/images/img10.jpg', category: 'bracelet', trending: true },
    { name: 'Pearl Neck Piece', price: 649, imagePath: '/images/img2.jpg', category: 'necklace', isNewArrival: true },
    { name: 'Gemstone Anklet', price: 1199, imagePath: '/images/img12.jpg', category: 'anklet' },
    { name: 'Laliguras Necklace Set', price: 3099, imagePath: '/images/img13.jpg', category: 'necklace', trending: true },
    { name: 'Silver NecklaceSet', price: 2099, imagePath: '/images/img14.jpg', category: 'necklace' },
    { name: 'Flower Necklace Set', price: 1099, imagePath: '/images/img15.jpg', category: 'necklace', isNewArrival: true },
    { name: 'Flower earring', price: 499, imagePath: '/images/img17.jpg', category: 'earring' },
    { name: 'Artisan earring', price: 899, imagePath: '/images/img16.jpg', category: 'earring', trending: true },
    { name: 'Dropdown Earring', price: 799, imagePath: '/images/img18.jpg', category: 'earring', isNewArrival: true },
];

export default function ShopPage() {
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const filters = ['All', 'Trending Now', 'New'];

    const normalizeProducts = (items: any[]): Product[] => {
        return items.map((p) => ({
            ...p,
            name: p.name,
            price: Number(p.price) || 0,
            imagePath: p.imagePath || '/images/img2.jpg',
            category: p.category || 'uncategorized',
            trending: !!p.trending,
            isNewArrival: !!p.isNewArrival,
        }));
    };

    const loadProducts = useCallback(() => {
        setLoading(true);
        getProducts()
            .then((data) => {
                const apiProducts = normalizeProducts(data || []);
                const hardcoded = normalizeProducts(HARDCODED_PRODUCTS);
                const seen = new Set<string>();
                const merged: Product[] = [];
                for (const p of [...apiProducts, ...hardcoded]) {
                    const key = (p.name || '').toLowerCase().trim();
                    if (key && !seen.has(key)) {
                        seen.add(key);
                        merged.push(p);
                    }
                }
                setProducts(merged);
            })
            .catch(() => {
                setProducts(normalizeProducts(HARDCODED_PRODUCTS));
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('favorites');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load favorites:', e);
        }
        loadProducts();
    }, [loadProducts]);

    const toggleFavorite = (productName: string) => {
        let newFavorites;
        if (favorites.includes(productName)) {
            newFavorites = favorites.filter(name => name !== productName);
        } else {
            newFavorites = [...favorites, productName];
        }
        setFavorites(newFavorites);
        try {
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
        } catch (e) {
            console.error('Failed to save favorites:', e);
        }
    };

    const getFilteredProducts = () => {
        let filtered = [...products];

        if (selectedFilter === 1) {
            filtered = filtered.filter(p => !!p.trending);
        } else if (selectedFilter === 2) {
            filtered = filtered.filter(p => !!p.isNewArrival);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        return filtered;
    };

    const filteredProducts = getFilteredProducts();

    return (
        <div className="pb-20 bg-gradient-to-b from-rose-100 to-white min-h-[calc(100vh-4rem)]">
            <div className="px-5 pt-6">
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Shop</h1>
                <p className="text-[#64748B] text-sm mb-5">Browse our full collection of handmade jewelry</p>

                <div className="flex justify-center">
                    <div className="w-full max-w-md h-12 bg-orange-50 rounded-full flex items-center px-4">
                        <svg className="w-5 h-5 text-[#94A3B8] cursor-pointer hover:text-[#ef5c5c] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => {}}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search necklace, bracelet, ring..."
                            className="ml-2 flex-1 bg-transparent border-none outline-none text-[#1A1A1A] placeholder:text-[#94A3B8]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="ml-2 text-[#94A3B8] hover:text-[#ef5c5c] transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-3">
                    <div className="flex gap-3">
                        {filters.map((filter, index) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(index)}
                                className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                                    selectedFilter === index
                                        ? 'bg-[#ef5c5c] text-white'
                                        : 'bg-transparent text-gray-500 hover:bg-orange-50'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 mt-8">
                {loading ? (
                    <div className="py-16 text-center">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#ef5c5c]/30 border-t-[#ef5c5c] mb-4"></div>
                        <p className="text-[#64748B] text-sm">Loading products...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={product._id || product.name}
                                    product={product}
                                    isFavorited={favorites.includes(product.name)}
                                    onToggleFavorite={() => toggleFavorite(product.name)}
                                    onSelect={() => setSelectedProduct(product)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center">
                                <svg className="w-16 h-16 mx-auto text-[#94A3B8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {searchQuery ? (
                                    <>
                                        <p className="text-[#64748B] text-sm">No products found for &quot;{searchQuery}&quot;</p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="mt-3 text-xs font-bold text-[#ef5c5c] hover:underline"
                                        >
                                            Clear search
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-[#64748B] text-sm">No products available</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}

function ProductCard({
    product,
    isFavorited,
    onToggleFavorite,
    onSelect,
}: {
    product: Product;
    isFavorited: boolean;
    onToggleFavorite: () => void;
    onSelect: () => void;
}) {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onSelect}
                className="w-full text-left bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
                <div className="relative aspect-square flex items-center justify-center p-6">
                    <Image
                        src={product.imagePath || '/images/img2.jpg'}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-contain"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.trending && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                                Trending
                            </span>
                        )}
                        {product.isNewArrival && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-600 text-white">
                                New
                            </span>
                        )}
                    </div>
                </div>
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                }}
                className="absolute top-3 right-3 bg-orange-50 rounded-full p-1.5 z-10"
            >
                <svg
                    className={`w-5 h-5 ${isFavorited ? 'text-[#ef5c5c] fill-current' : 'text-[#ef5c5c]'}`}
                    viewBox="0 0 24 24"
                >
                    {isFavorited ? (
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    ) : (
                        <path fill="none" stroke="currentColor" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    )}
                </svg>
            </button>
            <div className="text-center mt-2 px-3 pb-3">
                <h3 className="font-bold text-sm text-[#1A1A1A]">{product.name}</h3>
                <p className="text-[#ef5c5c] font-semibold text-xs mt-1">₹ {product.price}</p>
                <button
                    type="button"
                    onClick={onSelect}
                    className="mt-3 w-full h-10 inline-flex items-center justify-center rounded-full bg-[#ef5c5c] hover:bg-[#E53935] text-white text-sm font-bold transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
