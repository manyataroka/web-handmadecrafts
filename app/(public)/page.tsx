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

const trendingNames = new Set([
    'Beads Necklace',
    'Panchadhatu Ring',
    'Laliguras Necklace Set',
    'Dropdown Earring'
]);

const newNames = new Set([
    'Flower earring',
    'Pearl Neck Piece',
    'Adjustable Bracelet'
]);

export default function Home() {
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showMore, setShowMore] = useState(false);
    const filters = ['All', 'Trending Now', 'New'];

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

    const getFilteredProducts = () => {
        let filtered = [...products];

        if (selectedFilter === 1) { // Trending Now
            filtered = filtered.filter(p => trendingNames.has(p.name));
        } else if (selectedFilter === 2) { // New
            filtered = filtered.filter(p => newNames.has(p.name));
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.category.toLowerCase().includes(q)
            );
        }

        return showMore ? filtered : filtered.slice(0, 3);
    };

    const filteredProducts = getFilteredProducts();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white/70 to-[#FCEEEE] pb-20">
            <div className="px-5 pt-6">
                <div className="flex justify-center">
                    <div className="w-full max-w-md h-10 bg-[#C0C0C0] rounded-full flex items-center px-4">
                        <svg className="w-5 h-5 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            className="ml-2 flex-1 bg-transparent border-none outline-none text-black/80 text-center"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                    <button className="bg-[#FF0000] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                        Trending Now
                    </button>
                    <div className="flex gap-3">
                        {filters.map((filter, index) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(index)}
                                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                                    selectedFilter === index
                                        ? 'bg-[#C0C0C0] text-black'
                                        : 'bg-transparent text-black/50'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.name}
                            product={product}
                            isFavorited={favorites.includes(product.name)}
                            onToggleFavorite={() => toggleFavorite(product.name)}
                        />
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className="text-black/50 flex flex-col items-center"
                    >
                        <span className="text-sm">More</span>
                        <svg
                            className={`w-5 h-5 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProductCard({
    product,
    isFavorited,
    onToggleFavorite,
}: {
    product: Product;
    isFavorited: boolean;
    onToggleFavorite: () => void;
}) {
    return (
        <div className="relative">
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
                onClick={onToggleFavorite}
                className="absolute top-3 right-3 bg-[#FFE0E0] rounded-full p-1.5"
            >
                <svg
                    className={`w-5 h-5 ${isFavorited ? 'text-[#FF0000] fill-current' : 'text-[#FF0000]'}`}
                    viewBox="0 0 24 24"
                >
                    {isFavorited ? (
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
    );
}
