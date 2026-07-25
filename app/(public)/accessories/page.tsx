'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
    name: string;
    price: number;
    imagePath: string;
    category: string;
    isFavorited?: boolean;
}

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
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('favorites');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load favorites:', e);
        }
    }, []);

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-white/70 to-[#FCEEEE] pb-20">
            <div className="px-5 pt-6">
                <h1 className="text-2xl font-bold text-black mb-2">Accessories</h1>
                <p className="text-black/70 text-sm">Browse our full collection of handmade jewelry</p>
            </div>
            <div className="px-6 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.name} className="relative">
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="relative aspect-square flex items-center justify-center p-6">
                                    <Image
                                        src={product.imagePath}
                                        alt={product.name}
                                        width={200}
                                        height={200}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => toggleFavorite(product.name)}
                                className="absolute top-3 right-3 bg-[#FFE0E0] rounded-full p-1.5"
                            >
                                <svg
                                    className={`w-5 h-5 ${favorites.includes(product.name) ? 'text-[#FF0000] fill-current' : 'text-[#FF0000]'}`}
                                    viewBox="0 0 24 24"
                                >
                                    {favorites.includes(product.name) ? (
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    ) : (
                                        <path fill="none" stroke="currentColor" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    )}
                                </svg>
                            </button>
                            <div className="text-center mt-2">
                                <h3 className="font-bold text-sm text-black">{product.name}</h3>
                                <p className="text-[#FF0000] font-semibold text-xs mt-1">₹ {product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
