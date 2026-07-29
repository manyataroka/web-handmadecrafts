// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useEffect, useMemo, useRef, useState } from 'react';
// import {
//     isUserLoggedIn,
//     loadCart,
//     type CartItem,
// } from '../../../lib/cart';
// import { createOrder } from '../../../lib/api/order';

// const SKELETON = (
//     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
//         <div className="w-10 h-10 border-4 border-[#ef5c5c] border-t-transparent rounded-full animate-spin" />
//     </div>
// );

// const PAYMENT_OPTIONS = [
//     'Cash on Delivery',
//     'eSewa',
//     'Khalti',
// ];

// export default function CheckoutPage() {
//     const router = useRouter();
//     const [items, setItems] = useState<CartItem[]>([]);
//     const [mounted, setMounted] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const didRun = useRef(false);

//     const [address, setAddress] = useState('');
//     const [phone, setPhone] = useState('');
//     const [payment, setPayment] = useState(PAYMENT_OPTIONS[0]);
//     const [notes, setNotes] = useState('');
//     const [error, setError] = useState<string | null>(null);
//     const [submitting, setSubmitting] = useState(false);

//     useEffect(() => {
//         setMounted(true);

//         if (didRun.current) return;
//         didRun.current = true;

//         if (!isUserLoggedIn()) {
//             const t = window.setTimeout(() => {
//                 window.location.href = '/login';
//             }, 0);
//             return () => window.clearTimeout(t);
//         }

//         loadCart()
//             .then((res) => {
//                 setItems(res);
//                 if (res.length === 0) {
//                     const t = window.setTimeout(() => {
//                         window.location.href = '/cart';
//                     }, 0);
//                     return () => window.clearTimeout(t);
//                 }
//             })
//             .finally(() => setLoading(false));

//         return undefined;
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [router]);

//     const subtotal = useMemo(
//         () => items.reduce((s, it) => s + it.price * it.qty, 0),
//         [items]
//     );
//     const shipping = subtotal > 0 ? 99 : 0;
//     const total = subtotal + shipping;

//     if (!mounted || loading) {
//         return SKELETON;
//     }

//     const isFormValid = address.trim().length >= 2 && phone.trim().length >= 6;

//     const handleConfirmOrder = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);

//         if (!isFormValid) {
//             setError('Please fill in Delivery Address and Phone Number');
//             return;
//         }
//         if (items.length === 0) {
//             setError('Your cart is empty');
//             return;
//         }

//         setSubmitting(true);
//         try {
//             const order = await createOrder({
//                 address: address.trim(),
//                 phone: phone.trim(),
//                 paymentMethod: payment,
//                 notes: notes.trim() || undefined,
//             });

//             window.dispatchEvent(new CustomEvent('cart-updated'));
//             router.push(`/orders?new=${encodeURIComponent(order.id)}`);
//         } catch (err: any) {
//             const msg =
//                 err?.response?.data?.message ||
//                 err?.message ||
//                 'Failed to place order. Please try again.';
//             setError(typeof msg === 'string' ? msg : 'Something went wrong');
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     return (
//         <div className="pb-20 px-4 sm:px-6 pt-0 bg-gradient-to-b from-rose-100 to-white min-h-[calc(100vh-4rem)]">
//             <div className="mx-auto max-w-6xl w-full">
//                 <h1 className="text-center text-3xl sm:text-5xl font-bold tracking-tight mb-10" style={{ color: '#ef5c5c' }}>
//                     Checkout
//                 </h1>

//                 <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
//                     {/* Order Summary */}
//                     <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
//                         <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center" style={{ color: '#ef5c5c' }}>
//                             Order Summary
//                         </h2>

//                         {items.length === 0 ? (
//                             <div className="py-10 text-center text-[#64748B] text-sm">
//                                 Your cart is empty.{' '}
//                                 <Link
//                                     href="/shop"
//                                     className="font-bold underline" style={{ color: '#ef5c5c' }}
//                                 >
//                                     Go back to shop
//                                 </Link>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {items.map((it) => (
//                                     <div key={it.id} className="flex items-start gap-4">
//                                         <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-black/5 bg-white">
//                                             <Image
//                                                 src={it.image}
//                                                 alt={it.name}
//                                                 fill
//                                                 sizes="64px"
//                                                 className="object-cover"
//                                             />
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <p className="font-semibold text-base text-[#1A1A1A] truncate">
//                                                 {it.name}
//                                             </p>
//                                             <p className="text-sm font-bold mt-0.5" style={{ color: '#ef5c5c' }}>
//                                                 Rs. {it.price.toFixed(2)}
//                                             </p>
//                                             <p className="text-xs text-[#64748B] mt-1">
//                                                 Quantity: {it.qty}
//                                             </p>
//                                             <p className="text-sm font-semibold text-[#1A1A1A] mt-1">
//                                                 Subtotal: Rs. {(it.price * it.qty).toFixed(2)}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         <div className="h-px my-6" style={{ backgroundColor: 'rgba(239,92,92,0.4)' }} />

//                         <div className="flex items-center justify-between">
//                             <span className="font-bold text-lg sm:text-2xl" style={{ color: '#ef5c5c' }}>
//                                 Total:
//                             </span>
//                             <span className="font-extrabold text-xl sm:text-3xl" style={{ color: '#ef5c5c' }}>
//                                 Rs. {total.toFixed(2)}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Delivery Information */}
//                     <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-7">
//                         <h2 className="text-xl sm:text-2xl font-bold text-center" style={{ color: '#ef5c5c' }}>
//                             Delivery Information
//                         </h2>

//                         <div className="space-y-2">
//                             <label className="block text-sm font-semibold text-[#1A1A1A]">
//                                 Delivery Address
//                             </label>
//                             <textarea
//                                 value={address}
//                                 onChange={(e) => setAddress(e.target.value)}
//                                 rows={4}
//                                 placeholder="Enter your full delivery address"
//                                 className="w-full rounded-2xl px-4 py-3 text-[#1A1A1A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-0 bg-white border"
//                                 style={{ borderColor: 'rgba(239,92,92,0.3)' }}
//                                 onFocus={(e) => e.currentTarget.style.borderColor = '#ef5c5c'}
//                                 onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(239,92,92,0.3)'}
//                                 required
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <label className="block text-sm font-semibold text-[#1A1A1A]">
//                                 Phone Number
//                             </label>
//                             <input
//                                 type="tel"
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value)}
//                                 placeholder="Enter your phone number"
//                                 className="w-full h-12 rounded-2xl px-4 text-[#1A1A1A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-0 bg-white border"
//                                 style={{ borderColor: 'rgba(239,92,92,0.3)' }}
//                                 onFocus={(e) => e.currentTarget.style.borderColor = '#ef5c5c'}
//                                 onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(239,92,92,0.3)'}
//                                 required
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <label className="block text-sm font-semibold text-[#1A1A1A]">
//                                 Payment Method
//                             </label>
//                             <select
//                                 value={payment}
//                                 onChange={(e) => setPayment(e.target.value)}
//                                 className="w-full h-12 rounded-2xl px-4 text-[#1A1A1A] focus:outline-none focus:ring-0 bg-white border"
//                                 style={{ borderColor: 'rgba(239,92,92,0.3)' }}
//                                 onFocus={(e) => e.currentTarget.style.borderColor = '#ef5c5c'}
//                                 onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(239,92,92,0.3)'}
//                             >
//                                 {PAYMENT_OPTIONS.map((opt) => (
//                                     <option key={opt} value={opt}>
//                                         {opt}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="space-y-2">
//                             <label className="block text-sm font-semibold text-[#1A1A1A]">
//                                 Additional Notes
//                             </label>
//                             <textarea
//                                 value={notes}
//                                 onChange={(e) => setNotes(e.target.value)}
//                                 rows={3}
//                                 placeholder="Optional — gate code, landmarks, delivery instructions"
//                                 className="w-full rounded-2xl px-4 py-3 text-[#1A1A1A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-0 bg-white border"
//                                 style={{ borderColor: 'rgba(239,92,92,0.3)' }}
//                                 onFocus={(e) => e.currentTarget.style.borderColor = '#ef5c5c'}
//                                 onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(239,92,92,0.3)'}
//                             />
//                         </div>

//                         {error && (
//                             <div className="rounded-2xl bg-red-50 text-red-700 text-sm px-4 py-3 border border-red-100">
//                                 {error}
//                             </div>
//                         )}

//                         <button
//                             type="submit"
//                             disabled={submitting || items.length === 0 || !isFormValid}
//                             className="w-full h-12 inline-flex items-center justify-center rounded-full shadow-lg text-white font-bold text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
//                             style={{ backgroundColor: '#ef5c5c' }}
//                         >
//                             {submitting ? 'Placing order…' : 'Confirm Order'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }
