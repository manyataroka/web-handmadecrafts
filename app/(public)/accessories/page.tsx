'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '../../../lib/api/product';
import ProductDetailModal from '../_components/ProductDetailModal';
import { useFavorites } from '../../context/FavoritesContext';

const products: Product[] = [
    { name: 'Beads Necklace', price: 400, imagePath: '/images/img2.jpg', category: 'necklace' },
    { name: 'Round Chain', price: 325, imagePath: '/images/img13.jpg', category: 'necklace' },
    { name: 'Beads Pearl Bracelet', price: 450, imagePath: '/images/img5.jpg', category: 'bracelet' },
    { name: 'Adjustable Bracelet', price: 499, imagePath: '/images/img6.jpg', category: 'bracelet' },
    { name: 'Silver Ring', price: 999, imagePath: '/images/img7.jpg', category: 'ring' },
    { name: 'Panchadhatu Ring', price: 1099, imagePath: '/images/img8.jpg', category: 'ring' },
    { name: 'Adjustable Silver Ring', price: 999, imagePath: '/images/img9.jpg', category: 'ring' },
    { name: 'Pearl Bracelet', price: 599, imagePath: '/images/img10.jpg', category: 'bracelet' },
    { name: 'Pearl Neck Piece', price: 649, imagePath: '/images/img2.jpg', category: 'necklace' },
    { name: 'Gemstone Anklet', price: 1199, imagePath: '/images/img12.jpg', category: 'anklet' },
    { name: 'Laliguras Necklace Set', price: 3099, imagePath: '/images/img13.jpg', category: 'necklace' },
    { name: 'Silver NecklaceSet', price: 2099, imagePath: '/images/img14.jpg', category: 'necklace' },
    { name: 'Flower Necklace Set', price: 1099, imagePath: '/images/img15.jpg', category: 'necklace' },
    { name: 'Flower earring', price: 499, imagePath: '/images/img17.jpg', category: 'earring' },
    { name: 'Artisan earring', price: 899, imagePath: '/images/img16.jpg', category: 'earring' },
    { name: 'Dropdown Earring', price: 799, imagePath: '/images/img18.jpg', category: 'earring' },
];

export default function Page() {
    const { favorites, toggleFavorite } = useFavorites();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    return (
        <div className="pb-20 bg-gradient-to-b from-rose-100 to-white min-h-[calc(100vh-4rem)]">
            <div className="px-5 pt-6">
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Accessories</h1>
                <p className="text-[#64748B] text-sm">Browse our full collection of handmade jewelry</p>
            </div>
            <div className="px-6 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.name} className="relative">
                            <button
                                type="button"
                                onClick={() => setSelectedProduct(product)}
                                className="w-full text-left bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="relative aspect-square flex items-center justify-center p-6">
                                    <Image
                                        src={product.imagePath}
                                        alt={product.name}
                                        width={200}
                                        height={200}
                                        className="object-contain"
                                    />
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleFavorite(product.name)}
                                className="absolute top-3 right-3 bg-orange-50 rounded-full p-1.5 z-10"
                            >
                                <svg
                                    className={`w-5 h-5 ${favorites.includes(product.name) ? 'text-[#ef5c5c] fill-current' : 'text-[#ef5c5c]'}`}
                                    viewBox="0 0 24 24"
                                >
                                    {favorites.includes(product.name) ? (
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    ) : (
                                        <path fill="none" stroke="currentColor" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    )}
                                </svg>
                            </button>
                            <div className="text-center mt-2 px-3 pb-3">
                                <h3 className="font-bold text-sm text-[#1A1A1A]">{product.name}</h3>
                                <p className="text-[#ef5c5c] font-semibold text-xs mt-1">₹ {product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
