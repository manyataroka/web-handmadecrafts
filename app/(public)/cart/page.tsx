'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    isUserLoggedIn,
    loadCart,
    removeFromCart,
    updateCartQty,
    clearCart as clearUserCart,
    type CartItem,
} from '../../../lib/cart';

const SKELETON = (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#ef5c5c] border-t-transparent rounded-full animate-spin" />
    </div>
);

export default function Page() {
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>([]);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);
    const didRun = useRef(false);
    const didAttach = useRef(false);

    const onCartUpdated = () => {
        loadCart().then(setItems).catch(() => {});
    };

    useEffect(() => {
        setMounted(true);

        if (didRun.current) return;
        didRun.current = true;

        if (!isUserLoggedIn()) {
            const t = window.setTimeout(() => {
                window.location.href = '/login';
            }, 0);
            return () => window.clearTimeout(t);
        }

        loadCart()
            .then(setItems)
            .finally(() => setLoading(false));

        if (!didAttach.current) {
            didAttach.current = true;
            window.addEventListener('cart-updated', onCartUpdated);
        }
        return () => {
            window.removeEventListener('cart-updated', onCartUpdated);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const subtotal = useMemo(
        () => items.reduce((s, it) => s + it.price * it.qty, 0),
        [items]
    );
    const totalQty = useMemo(
        () => items.reduce((s, it) => s + it.qty, 0),
        [items]
    );
    const shipping = subtotal > 0 ? 99 : 0;
    const total = subtotal + shipping;

    if (!mounted || loading) {
        return SKELETON;
    }

    const updateQty = async (id: string, delta: number) => {
        const current = items.find((it) => it.id === id);
        if (!current) return;
        const nextQty = Math.max(1, current.qty + delta);
        const next = await updateCartQty(id, nextQty);
        setItems(next);
    };

    const removeItem = async (id: string) => {
        const next = await removeFromCart(id);
        setItems(next);
    };

    const handleClearCart = async () => {
        if (items.length === 0) return;
        setClearing(true);
        try {
            const next = await clearUserCart();
            setItems(next);
        } finally {
            setClearing(false);
        }
    };

    return (
        <div className="pb-20 px-4 sm:px-6 pt-0 bg-gradient-to-b from-rose-100 to-white min-h-[calc(100vh-4rem)]">
            <div className="mx-auto max-w-5xl w-full">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333] tracking-tight">
                        Shopping Cart
                    </h1>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-black/10 text-[#64748B] text-sm font-semibold hover:bg-[#FAFAFA] hover:text-[#ef5c5c] transition-colors"
                        >
                            Continue Shopping
                        </Link>
                        <button
                            type="button"
                            onClick={handleClearCart}
                            disabled={clearing || items.length === 0}
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#ef5c5c] hover:bg-[#E53935] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                        >
                            {clearing ? 'Clearing…' : 'Clear Cart'}
                        </button>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl shadow-sm mb-6">
                    {items.length === 0 ? (
                        <div className="px-6 sm:px-8 py-16 text-center">
                            <p className="text-[#64748B] text-base mb-4">Your cart is empty.</p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#ef5c5c] hover:bg-[#E53935] text-white text-sm font-semibold transition-colors"
                            >
                                Browse Shop
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-black/5">
                            {items.map((it) => (
                                <div
                                    key={it.id}
                                    className="px-5 sm:px-8 py-5 flex items-center gap-4 sm:gap-6"
                                >
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-white">
                                        <Image
                                            src={it.image}
                                            alt={it.name}
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-base sm:text-lg text-[#1A1A1A] truncate">
                                            {it.name}
                                        </h3>
                                        <p className="text-[#ef5c5c] font-bold text-sm mt-1">
                                            Rs. {it.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-4 sm:gap-6">
                                        <div className="inline-flex items-center gap-2 bg-[#FAFAFA] rounded-full px-1.5 py-1">
                                            <button
                                                type="button"
                                                onClick={() => updateQty(it.id, -1)}
                                                className="h-7 w-7 inline-flex items-center justify-center rounded-full text-[#64748B] hover:bg-white hover:text-[#ef5c5c] transition-colors font-bold text-lg leading-none"
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span className="w-5 sm:w-6 text-center font-semibold text-[#1A1A1A] text-sm">
                                                {it.qty}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQty(it.id, 1)}
                                                className="h-7 w-7 inline-flex items-center justify-center rounded-full text-[#64748B] hover:bg-white hover:text-[#ef5c5c] transition-colors font-bold text-lg leading-none"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="min-w-[110px] text-right font-semibold text-[#ef5c5c] sm:text-lg">
                                            Rs. {(it.price * it.qty).toFixed(2)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(it.id)}
                                            aria-label="Remove item"
                                            className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-[#ef5c5c] text-white hover:bg-[#E53935] transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                                <path d="M18 6 6 18" />
                                                <path d="m6 6 12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Mobile stack: qty, price, remove */}
                                    <div className="sm:hidden flex flex-col items-end gap-2">
                                        <div className="inline-flex items-center gap-2 bg-[#FAFAFA] rounded-full px-1.5 py-1">
                                            <button
                                                type="button"
                                                onClick={() => updateQty(it.id, -1)}
                                                className="h-7 w-7 inline-flex items-center justify-center rounded-full text-[#64748B] hover:bg-white hover:text-[#ef5c5c] transition-colors font-bold text-lg leading-none"
                                            >
                                                −
                                            </button>
                                            <span className="w-5 text-center font-semibold text-[#1A1A1A] text-sm">
                                                {it.qty}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQty(it.id, 1)}
                                                className="h-7 w-7 inline-flex items-center justify-center rounded-full text-[#64748B] hover:bg-white hover:text-[#ef5c5c] transition-colors font-bold text-lg leading-none"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-[#ef5c5c]">
                                                Rs. {(it.price * it.qty).toFixed(2)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(it.id)}
                                                className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-[#ef5c5c] text-white hover:bg-[#E53935] transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                                    <path d="M18 6 6 18" />
                                                    <path d="m6 6 12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Totals + Checkout */}
                {items.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm px-5 sm:px-8 py-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[#1A1A1A] font-semibold text-base sm:text-lg">
                                Total Items:
                            </span>
                            <span className="font-semibold text-[#64748B] text-base sm:text-lg">
                                {totalQty}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-[#64748B]">
                            <span className="font-medium">Subtotal</span>
                            <span>Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-[#64748B]">
                            <span className="font-medium">Shipping</span>
                            <span>Rs. {shipping.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-black/10" />
                        <div className="flex items-center justify-between">
                            <span className="text-[#1A1A1A] font-bold text-lg sm:text-xl">
                                Total Amount:
                            </span>
                            <span className="font-extrabold text-[#ef5c5c] text-lg sm:text-2xl">
                                Rs. {total.toFixed(2)}
                            </span>
                        </div>
                        <div className="pt-3 flex justify-end">
                            <button
                                type="button"
                                onClick={() => router.push('/checkout')}
                                className="h-12 px-10 inline-flex items-center justify-center rounded-full shadow-lg bg-[#ef5c5c] hover:bg-[#E53935] text-white font-bold text-lg transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
