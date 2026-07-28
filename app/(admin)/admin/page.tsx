"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Product,
    getProducts,
    createProduct,
    deleteProduct,
} from "../../../lib/api/product";
import { setAuthToken } from "../../../lib/api/axios-instance";
import {
    Order,
    listOrders,
    type OrderStatus,
} from "../../../lib/api/order";

const CATEGORIES = ["necklace", "bracelet", "ring", "anklet", "earring"];
const IMAGE_SUGGESTIONS = [
    "/images/img2.jpg",
    "/images/img5.jpg",
    "/images/img6.jpg",
    "/images/img7.jpg",
    "/images/img8.jpg",
    "/images/img9.jpg",
    "/images/img10.jpg",
    "/images/img12.jpg",
    "/images/img13.jpg",
    "/images/img14.jpg",
    "/images/img15.jpg",
    "/images/img16.jpg",
    "/images/img17.jpg",
    "/images/img18.jpg",
];

const STATUS_STYLES: Record<OrderStatus, string> = {
    Processing: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
};

export default function AdminDashboard() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [pending, setTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<"products" | "orders">("orders");

    const [form, setForm] = useState({
        name: "",
        price: "",
        imagePath: "/images/img2.jpg",
        category: "necklace",
        trending: false,
        isNewArrival: false,
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const stats = {
        users: 248,
        orders: orders.length,
        products: products.length,
        revenue,
    };

    const loadProducts = () => {
        setLoading(true);
        getProducts()
            .then((data) => setProducts(data || []))
            .catch((err) => console.error("Failed to load products", err))
            .finally(() => setLoading(false));
    };

    const loadOrders = () => {
        setOrdersLoading(true);
        listOrders()
            .then((data) => setOrders(data || []))
            .catch((err) => console.error("Failed to load orders", err))
            .finally(() => setOrdersLoading(false));
    };

    useEffect(() => {
        try {
            const isLoggedIn = sessionStorage.getItem("isLoggedIn");
            const isAdmin = sessionStorage.getItem("isAdmin");
            const token = sessionStorage.getItem("token");
            if (token) setAuthToken(token);
            if (!isLoggedIn) {
                router.replace("/login");
                return;
            }
            if (isAdmin !== "1") {
                router.replace("/shop");
                return;
            }
        } catch (e) {
            router.replace("/login");
            return;
        }
        try {
            const u = sessionStorage.getItem("username");
            setUsername(u);
        } catch (e) {
            setUsername(null);
        }
        loadProducts();
        loadOrders();
    }, [router]);

    const logout = () => {
        try {
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("isAdmin");
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("token");
            setAuthToken(null);
        } catch (e) {}
        try {
            window.dispatchEvent(new CustomEvent('auth-changed'));
        } catch (_) {}
        router.replace("/login");
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setSuccessMsg(null);

        if (!form.name.trim()) return setFormError("Product name is required");
        const priceNum = Number(form.price);
        if (!Number.isFinite(priceNum) || priceNum <= 0)
            return setFormError("Price must be a positive number");
        if (!form.imagePath.trim()) return setFormError("Image path is required");
        if (!form.category.trim()) return setFormError("Category is required");

        try {
            await createProduct({
                name: form.name.trim(),
                price: priceNum,
                imagePath: form.imagePath.trim(),
                category: form.category.trim(),
                trending: form.trending,
                isNewArrival: form.isNewArrival,
            });
            setSuccessMsg(`Product "${form.name}" created successfully!`);
            setForm({
                name: "",
                price: "",
                imagePath: "/images/img2.jpg",
                category: "necklace",
                trending: false,
                isNewArrival: false,
            });
            loadProducts();
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create product";
            setFormError(
                typeof msg === "object" ? JSON.stringify(msg) : String(msg)
            );
        }
    };

    const handleDeleteProduct = async (product: Product) => {
        if (!product._id) return;
        if (!confirm(`Delete product "${product.name}"? This cannot be undone.`))
            return;
        try {
            await deleteProduct(product._id);
            setProducts((prev) =>
                prev.filter((p) => p._id !== product._id)
            );
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to delete product";
            alert(typeof msg === "object" ? JSON.stringify(msg) : String(msg));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-100 to-white">
            <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-black/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 group"
                        >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#E53935] text-white font-semibold">
                                A
                            </span>
                            <span className="text-base font-semibold tracking-tight group-hover:opacity-80 transition-opacity">
                                Admin Panel
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-black/10 text-sm font-medium hover:bg-foreground/5 transition-colors"
                        >
                            View Site
                        </Link>
                        <span className="text-sm text-black/60 hidden sm:inline">
                            {username ? `Welcome, ${username}` : ""}
                        </span>
                        <button
                            onClick={logout}
                            className="h-9 px-3 inline-flex items-center justify-center rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-black mb-6">
                    Dashboard Overview
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        {
                            label: "Total Users",
                            value: stats.users,
                            color: "from-blue-500 to-blue-600",
                            icon: "👥",
                        },
                        {
                            label: "Total Orders",
                            value: stats.orders,
                            color: "from-purple-500 to-purple-600",
                            icon: "📦",
                        },
                        {
                            label: "Products",
                            value: stats.products,
                            color: "from-orange-500 to-orange-600",
                            icon: "💎",
                        },
                        {
                            label: "Revenue (₹)",
                            value: stats.revenue.toLocaleString(),
                            color: "from-green-500 to-green-600",
                            icon: "💰",
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden"
                        >
                            <div
                                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${s.color} opacity-10 rounded-bl-full`}
                            ></div>
                            <div className="relative">
                                <div className="text-2xl mb-2">{s.icon}</div>
                                <p className="text-black/50 text-xs font-medium uppercase tracking-wide">
                                    {s.label}
                                </p>
                                <p className="text-2xl font-bold text-black mt-1">
                                    {s.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2 mb-6 border-b border-black/10">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`h-11 px-5 text-sm font-semibold rounded-t-lg transition-colors ${
                            activeTab === "orders"
                                ? "bg-white text-[#E53935] border border-b-0 border-black/10"
                                : "text-black/60 hover:text-black"
                        }`}
                    >
                        📦 Orders ({ordersLoading ? "..." : orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`h-11 px-5 text-sm font-semibold rounded-t-lg transition-colors ${
                            activeTab === "products"
                                ? "bg-white text-[#E53935] border border-b-0 border-black/10"
                                : "text-black/60 hover:text-black"
                        }`}
                    >
                        💎 Products ({loading ? "..." : products.length})
                    </button>
                </div>

                {activeTab === "orders" ? (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-black">
                                All Orders ({ordersLoading ? "..." : orders.length})
                            </h2>
                            <button
                                onClick={loadOrders}
                                className="text-xs font-semibold text-[#E53935] hover:underline"
                            >
                                Refresh
                            </button>
                        </div>
                        {ordersLoading ? (
                            <div className="py-12 text-center text-black/50 text-sm">
                                Loading orders...
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="py-12 text-center text-black/50 text-sm">
                                No orders placed yet. Orders will appear here when
                                customers checkout.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map((o) => {
                                    const isOpen = expandedOrder === o.id;
                                    const userName =
                                        o.user?.username ||
                                        o.user?.email ||
                                        "Guest";
                                    const userDisplay =
                                        o.user?.firstName || o.user?.lastName
                                            ? `${o.user.firstName || ""} ${o.user.lastName || ""}`.trim()
                                            : userName;
                                    return (
                                        <div
                                            key={o.id}
                                            className="border border-black/10 rounded-xl overflow-hidden"
                                        >
                                            <button
                                                onClick={() =>
                                                    setExpandedOrder(
                                                        isOpen ? null : o.id
                                                    )
                                                }
                                                className="w-full text-left p-4 hover:bg-black/5 transition-colors"
                                            >
                                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 items-center">
                                                    <div>
                                                        <p className="text-[10px] uppercase text-black/40 font-semibold tracking-wide">
                                                            Order #
                                                        </p>
                                                        <p className="text-sm font-semibold text-black truncate">
                                                            {o.id.slice(-8)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase text-black/40 font-semibold tracking-wide">
                                                            Customer
                                                        </p>
                                                        <p className="text-sm font-medium text-black truncate">
                                                            {userDisplay}
                                                        </p>
                                                        {o.user?.email && (
                                                            <p className="text-xs text-black/50 truncate">
                                                                {o.user.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase text-black/40 font-semibold tracking-wide">
                                                            Date
                                                        </p>
                                                        <p className="text-sm text-black/80 truncate">
                                                            {o.date}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase text-black/40 font-semibold tracking-wide">
                                                            Items
                                                        </p>
                                                        <p className="text-sm font-semibold text-black">
                                                            {o.items} items
                                                        </p>
                                                        <p className="text-sm font-bold text-[#E53935]">
                                                            ₹ {o.total}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase text-black/40 font-semibold tracking-wide">
                                                            Payment
                                                        </p>
                                                        <p className="text-sm text-black/80 truncate">
                                                            {o.payment}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between lg:justify-end gap-3">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_STYLES[o.status] || "bg-gray-100 text-gray-800"}`}
                                                        >
                                                            {o.status}
                                                        </span>
                                                        <span className="text-lg text-black/40">
                                                            {isOpen ? "−" : "+"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                            {isOpen && (
                                                <div className="border-t border-black/10 p-5 bg-[#FFF8F8]">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-xs uppercase font-bold text-black/50 tracking-wide mb-2">
                                                                Delivery Details
                                                            </h4>
                                                            <div className="space-y-1.5 text-sm">
                                                                <p className="text-black">
                                                                    <span className="font-semibold">
                                                                        Phone:{" "}
                                                                    </span>
                                                                    {o.phone}
                                                                </p>
                                                                <p className="text-black">
                                                                    <span className="font-semibold">
                                                                        Address:{" "}
                                                                    </span>
                                                                    {o.address}
                                                                </p>
                                                                {o.notes && (
                                                                    <p className="text-black">
                                                                        <span className="font-semibold">
                                                                            Notes:{" "}
                                                                        </span>
                                                                        {o.notes}
                                                                    </p>
                                                                )}
                                                                <p className="text-black">
                                                                    <span className="font-semibold">
                                                                        Subtotal:{" "}
                                                                    </span>
                                                                    ₹ {o.subtotal}
                                                                </p>
                                                                <p className="text-black">
                                                                    <span className="font-semibold">
                                                                        Shipping:{" "}
                                                                    </span>
                                                                    ₹ {o.shipping}
                                                                </p>
                                                                <p className="text-[#E53935] font-bold text-base">
                                                                    Total: ₹ {o.total}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs uppercase font-bold text-black/50 tracking-wide mb-2">
                                                                Items ({o.lineItems.length})
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {o.lineItems.map(
                                                                    (li, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="flex items-center gap-3 p-2 bg-white rounded-lg border border-black/5"
                                                                        >
                                                                            <div className="w-12 h-12 rounded-md overflow-hidden border border-black/5 bg-white flex-shrink-0 flex items-center justify-center">
                                                                                <Image
                                                                                    src={
                                                                                        li.image ||
                                                                                        "/images/img2.jpg"
                                                                                    }
                                                                                    alt={
                                                                                        li.name
                                                                                    }
                                                                                    width={
                                                                                        40
                                                                                    }
                                                                                    height={
                                                                                        40
                                                                                    }
                                                                                    className="object-contain"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-sm font-semibold text-black truncate">
                                                                                    {li.name}
                                                                                </p>
                                                                                <p className="text-xs text-black/60">
                                                                                    Qty:{" "}
                                                                                    {li.qty} ×
                                                                                    ₹{" "}
                                                                                    {li.price}
                                                                                </p>
                                                                            </div>
                                                                            <p className="text-sm font-bold text-[#E53935] whitespace-nowrap">
                                                                                ₹{" "}
                                                                                {li.qty *
                                                                                    li.price}
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-black mb-4">
                                Add New Product
                            </h2>
                            <form
                                onSubmit={handleCreateProduct}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-black/80 mb-1">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                name: e.target.value,
                                            }))
                                        }
                                        placeholder="e.g. Gold Ring"
                                        className="w-full h-10 rounded-md border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E53935]/60"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black/80 mb-1">
                                        Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                price: e.target.value,
                                            }))
                                        }
                                        placeholder="e.g. 999"
                                        className="w-full h-10 rounded-md border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E53935]/60"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black/80 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                category: e.target.value,
                                            }))
                                        }
                                        className="w-full h-10 rounded-md border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E53935]/60"
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c.charAt(0).toUpperCase() +
                                                    c.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black/80 mb-1">
                                        Image Path
                                    </label>
                                    <select
                                        value={form.imagePath}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                imagePath: e.target.value,
                                            }))
                                        }
                                        className="w-full h-10 rounded-md border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#E53935]/60 mb-2"
                                    >
                                        {IMAGE_SUGGESTIONS.map((p) => (
                                            <option key={p} value={p}>
                                                {p}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="w-20 h-20 rounded-lg border border-black/10 overflow-hidden bg-gray-50 flex items-center justify-center">
                                        <Image
                                            src={form.imagePath}
                                            alt="preview"
                                            width={60}
                                            height={60}
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <label className="inline-flex items-center gap-2 text-sm text-black/70 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.trending}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    trending: e.target.checked,
                                                }))
                                            }
                                            className="w-4 h-4 accent-[#E53935]"
                                        />
                                        Trending
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm text-black/70 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.isNewArrival}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    isNewArrival:
                                                        e.target.checked,
                                                }))
                                            }
                                            className="w-4 h-4 accent-[#E53935]"
                                        />
                                        New
                                    </label>
                                </div>
                                {formError && (
                                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                                        {formError}
                                    </p>
                                )}
                                {successMsg && (
                                    <p className="text-xs text-green-700 bg-green-50 p-2 rounded">
                                        {successMsg}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={pending}
                                    className="w-full h-10 rounded-md bg-[#E53935] text-white text-sm font-semibold hover:bg-[#d32f2f] transition-colors disabled:opacity-60"
                                >
                                    {pending ? "Adding..." : "Add Product"}
                                </button>
                            </form>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-black">
                                    Manage Products (
                                    {loading ? "..." : products.length})
                                </h2>
                                <button
                                    onClick={loadProducts}
                                    className="text-xs font-semibold text-[#E53935] hover:underline"
                                >
                                    Refresh
                                </button>
                            </div>
                            {loading ? (
                                <div className="py-12 text-center text-black/50 text-sm">
                                    Loading products...
                                </div>
                            ) : products.length === 0 ? (
                                <div className="py-12 text-center text-black/50 text-sm">
                                    No products yet — add your first product using
                                    the form.
                                </div>
                            ) : (
                                <div className="overflow-x-auto -mx-2">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-black/10 text-black/50">
                                                <th className="text-left font-medium py-3 px-2">
                                                    Product
                                                </th>
                                                <th className="text-left font-medium py-3 px-2">
                                                    Category
                                                </th>
                                                <th className="text-left font-medium py-3 px-2">
                                                    Price
                                                </th>
                                                <th className="text-left font-medium py-3 px-2">
                                                    Flags
                                                </th>
                                                <th className="text-right font-medium py-3 px-2">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((p) => (
                                                <tr
                                                    key={p._id || p.name}
                                                    className="border-b border-black/5 last:border-0 align-middle"
                                                >
                                                    <td className="py-3 px-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg border border-black/10 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                                                                <Image
                                                                    src={
                                                                        p.imagePath ||
                                                                        "/images/img2.jpg"
                                                                    }
                                                                    alt={p.name}
                                                                    width={30}
                                                                    height={30}
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                            <span className="font-medium text-black truncate max-w-[180px]">
                                                                {p.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2 text-black/70 capitalize">
                                                        {p.category}
                                                    </td>
                                                    <td className="py-3 px-2 font-semibold text-black">
                                                        ₹ {p.price}
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <div className="flex flex-wrap gap-1">
                                                            {p.trending && (
                                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700">
                                                                    Trending
                                                                </span>
                                                            )}
                                                            {p.isNewArrival && (
                                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                                                                    New
                                                                </span>
                                                            )}
                                                            {!p.trending &&
                                                                !p.isNewArrival && (
                                                                    <span className="text-xs text-black/30">
                                                                        —
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2 text-right">
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteProduct(
                                                                    p
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 h-8 px-3 rounded-md text-xs font-semibold text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                className="w-3.5 h-3.5"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
