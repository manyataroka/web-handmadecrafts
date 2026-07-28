'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { isUserLoggedIn } from '../../../lib/cart';
import { listOrders, type Order, type OrderStatus } from '../../../lib/api/order';

const STATUS_STYLES: Record<OrderStatus, string> = {
    Delivered: 'bg-[#DCFCE7] text-[#15803D]',
    Shipped: 'bg-[#FEF3C7] text-[#A16207]',
    Processing: 'bg-[#DBEAFE] text-[#1D4ED8]',
};

const SKELETON = (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#ef5c5c] border-t-transparent rounded-full animate-spin" />
    </div>
);

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const newOrderId = searchParams?.get('new');

    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const didRun = useRef(false);

    useEffect(() => {
        setMounted(true);

        if (didRun.current) return;
        didRun.current = true;

        let ok = false;
        try {
            ok = typeof window !== 'undefined' && isUserLoggedIn();
        } catch (_) {
            ok = false;
        }

        if (!ok) {
            const t = window.setTimeout(() => {
                window.location.href = '/login';
            }, 0);
            return () => window.clearTimeout(t);
        }

        listOrders()
            .then((data) => {
                setOrders(data || []);
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || err?.message || 'Failed to load orders';
                setError(typeof msg === 'string' ? msg : 'Failed to load orders');
                setOrders([]);
            })
            .finally(() => setLoading(false));

        return undefined;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    if (!mounted || loading) {
        return SKELETON;
    }

    return (
        <div className="pb-20 px-4 sm:px-6 pt-0 bg-gradient-to-b from-rose-100 to-white min-h-[calc(100vh-4rem)]">
            <div className="mx-auto max-w-6xl w-full space-y-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-lg px-6 sm:px-10 py-7 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
                        My Orders
                    </h1>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-full shadow-lg font-bold text-base transition-colors text-white"
                        style={{ backgroundColor: '#E91E63' }}
                    >
                        Continue Shopping
                    </Link>
                </div>

                {error && (
                    <div className="bg-white rounded-3xl shadow-lg px-6 py-4 border-l-4" style={{ borderLeftColor: '#ef5c5c' }}>
                        <p className="text-sm text-red-700">{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-2 text-xs font-bold hover:underline" style={{ color: '#ef5c5c' }}
                        >
                            Refresh
                        </button>
                    </div>
                )}

                {orders.length === 0 && !error ? (
                    <div className="bg-white rounded-3xl shadow-lg py-16 px-8 text-center">
                        <p className="text-lg text-[#64748B] mb-5">
                            You haven&apos;t placed any orders yet.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-7 py-3 rounded-full shadow-lg text-white font-bold transition-colors"
                            style={{ backgroundColor: '#E91E63' }}
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                isNew={order.id === newOrderId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderCard({ order, isNew }: { order: Order; isNew?: boolean }) {
    return (
        <div
            className={`bg-white rounded-3xl shadow-lg px-6 sm:px-10 py-7 sm:py-8 transition-all ${
                isNew ? 'ring-2 ring-[#ef5c5c]' : ''
            }`}
        >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-sm sm:text-lg font-bold text-[#1A1A1A]">
                            Order #{order.id}
                        </h2>
                        {isNew && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ef5c5c] text-white text-xs font-bold">
                                Just placed
                            </span>
                        )}
                    </div>
                    <div className="bg-[#FFF5F7] rounded-2xl px-5 py-3 inline-block">
                        <p className="text-[#64748B] text-sm sm:text-base">{order.date}</p>
                    </div>
                </div>
                <span
                    className={`self-start sm:self-auto px-5 py-2 rounded-full shadow-sm text-sm font-bold whitespace-nowrap ${STATUS_STYLES[order.status]}`}
                >
                    {order.status}
                </span>
            </div>

            {/* Line items preview */}
            {order.lineItems?.length > 0 && (
                <div className="mb-7 bg-[#FFF5F7] rounded-2xl p-4 sm:p-5 space-y-3">
                    <h3 className="font-bold text-sm text-[#1A1A1A] mb-1">Items</h3>
                    {order.lineItems.map((li, idx) => (
                        <div
                            key={li.productId || `${li.name}-${idx}`}
                            className="flex items-center gap-3"
                        >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-black/5">
                                <Image
                                    src={li.image}
                                    alt={li.name}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                                    {li.name}
                                </p>
                                <p className="text-xs text-[#64748B]">Qty: {li.qty}</p>
                            </div>
                            <p className="text-sm font-bold" style={{ color: '#ef5c5c' }}>
                                Rs. {(li.price * li.qty).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <div className="h-px my-7" style={{ backgroundColor: 'rgba(194,24,91,0.3)' }} />

            <div className="bg-[#FFF5F7] rounded-2xl p-5 sm:p-7 space-y-4">
                <div className="flex items-center justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(194,24,91,0.2)' }}>
                    <span className="font-bold text-base sm:text-lg text-[#1A1A1A]">
                        Total Amount:
                    </span>
                    <span className="font-extrabold text-lg sm:text-xl text-[#1A1A1A]">
                        Rs. {order.total.toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(194,24,91,0.2)' }}>
                    <span className="font-bold text-base sm:text-lg text-[#1A1A1A]">
                        Subtotal:
                    </span>
                    <span className="font-medium" style={{ color: '#ef5c5c' }}>
                        Rs. {order.subtotal.toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(194,24,91,0.2)' }}>
                    <span className="font-bold text-base sm:text-lg text-[#1A1A1A]">
                        Shipping:
                    </span>
                    <span className="text-[#64748B] font-medium">
                        Rs. {order.shipping.toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(194,24,91,0.2)' }}>
                    <span className="font-bold text-base sm:text-lg text-[#1A1A1A]">
                        Items:
                    </span>
                    <span className="text-[#64748B] font-medium">
                        {order.items} items
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(194,24,91,0.2)' }}>
                    <span className="font-bold text-base sm:text-lg text-[#1A1A1A]">
                        Delivery Address:
                    </span>
                    <span className="text-[#64748B] font-medium text-right max-w-[60%]">
                        {order.address}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(194,24,91,0.2)' }}>
                    <span className="font-bold text-base sm:text-lg text-[#1A1A1A]">
                        Phone:
                    </span>
                    <span className="text-[#64748B] font-medium text-right">
                        {order.phone}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                    <span className="font-bold text-base sm:text-lg text-[#1A1A1A]">
                        Payment Method:
                    </span>
                    <span className="text-[#64748B] font-medium">
                        {order.payment}
                    </span>
                </div>

                {order.notes && (
                    <div className="flex items-start justify-between gap-4 pt-3" style={{ borderTop: '1px solid rgba(194,24,91,0.2)' }}>
                        <span className="font-bold text-sm text-[#1A1A1A]">
                            Notes:
                        </span>
                        <span className="text-[#64748B] font-medium text-right max-w-[70%]">
                            {order.notes}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
