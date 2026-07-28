'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { addToCart, isUserLoggedIn } from '../../../lib/cart';
import type { Product } from '../../../lib/api/product';

const INR = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
});

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductDetailModal({
    product,
    isOpen,
    onClose,
}: ProductDetailModalProps) {
    const router = useRouter();
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setAdding(false);
            setAdded(false);
        }
    }, [isOpen, product]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !product) return null;

    const handleAddToCart = async () => {
        if (!isUserLoggedIn()) {
            router.push('/login');
            return;
        }

        setAdding(true);
        try {
            await addToCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                imagePath: product.imagePath || '/images/img2.jpg',
            });
            setAdded(true);
            window.setTimeout(() => {
                setAdded(false);
                onClose();
            }, 600);
        } catch (_) {
            alert('Could not add item to cart. Please try again.');
        } finally {
            setAdding(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                aria-label="Close product details"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-[#FFE0E0] border-b border-[#ffcdd2]">
                    <h2 id="product-detail-title" className="text-base font-bold text-[#c2185b]">
                        Product Details
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="h-8 w-8 inline-flex items-center justify-center rounded-full text-[#c2185b] hover:bg-white/80 transition-colors text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="px-6 pt-6 pb-5 flex flex-col items-center">
                    <div className="relative w-full aspect-square max-w-[280px] rounded-xl overflow-hidden bg-[#FFF5F7] mb-5">
                        <Image
                            src={product.imagePath || '/images/img2.jpg'}
                            alt={product.name}
                            fill
                            sizes="280px"
                            className="object-contain p-4"
                        />
                    </div>

                    <h3 className="text-xl font-bold text-[#c2185b] text-center mb-2">
                        {product.name}
                    </h3>
                    <p className="text-lg font-semibold text-[#1A1A1A] mb-6">
                        {INR.format(product.price)}
                    </p>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="w-full max-w-xs h-12 rounded-full bg-[#E91E63] hover:bg-[#c2185b] disabled:opacity-70 text-white font-bold text-lg transition-colors"
                    >
                        {added ? 'Added!' : adding ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
