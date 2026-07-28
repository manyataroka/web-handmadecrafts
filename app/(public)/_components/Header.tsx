"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { isUserLoggedIn } from "../../../lib/cart";
import { useCart } from "../../context/CartContext";

const ALL_NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact Us" },
    { href: "/orders", label: "Orders" },
];

const GUEST_NAV_LINKS = [
    { href: "/", label: "Home" },
];

export default function Header() {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const isRefreshing = useRef(false);

    useEffect(() => {
        const refresh = async () => {
            if (isRefreshing.current) return;
            isRefreshing.current = true;
            try {
                const v = sessionStorage.getItem('isLoggedIn');
                const loggedIn = !!v && (v === 'true' || v === '1');
                setIsLoggedIn(loggedIn);
                setUsername(sessionStorage.getItem('username'));
            } catch (_e) {
                setIsLoggedIn(false);
            } finally {
                isRefreshing.current = false;
            }
        };
        refresh();
        window.addEventListener('storage', refresh);
        window.addEventListener('auth-changed', refresh);
        return () => {
            window.removeEventListener('storage', refresh);
            window.removeEventListener('auth-changed', refresh);
        };
    }, []);

    const handleLogout = () => {
        try {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('isAdmin');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('token');
        } catch (e) {}
        try {
            window.dispatchEvent(new CustomEvent('auth-changed'));
        } catch (_) {}
        setIsLoggedIn(false);
        setUsername(null);
        window.location.href = '/';
    };

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));
    const navLinks = isLoggedIn ? ALL_NAV_LINKS : GUEST_NAV_LINKS;

    return (
        <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-[#E2E8F0]">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] w-full">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-10 w-10 rounded-full overflow-hidden border border-[#E2E8F0]">
                                <Image src="/images/Image1.jpg" alt="Craftybee" width={40} height={40} className="object-cover w-full h-full" />
                            </div>
                            <span className="text-base font-bold tracking-tight group-hover:opacity-80 transition-opacity text-[#ef5c5c]">
                                Craftybee
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6 justify-self-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={
                                    "text-sm font-semibold transition-colors hover:text-[#ef5c5c] " +
                                    (isActive(link.href) ? "text-[#ef5c5c]" : "text-[#64748B]")
                                }
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Auth + Mobile Toggle */}
                    <div className="flex items-center gap-2 md:justify-self-end">
                        <div className="hidden sm:flex items-center gap-3">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/profile"
                                        aria-label="Profile"
                                        className="h-10 w-10 inline-flex items-center justify-center rounded-[10px] bg-[#ef5c5c] text-white hover:bg-[#E53935] transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </Link>
                                    <Link
                                        href="/cart"
                                        aria-label="Cart"
                                        className="h-10 w-10 inline-flex items-center justify-center rounded-[10px] bg-[#ef5c5c] text-white hover:bg-[#E53935] transition-colors relative"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <circle cx="8" cy="21" r="1" />
                                            <circle cx="19" cy="21" r="1" />
                                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                                        </svg>
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-4 min-w-[1rem] px-1 rounded-full bg-[#ef5c5c] text-white text-[10px] font-bold inline-flex items-center justify-center border-2 border-white">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                    <button onClick={handleLogout} className="h-9 px-4 inline-flex items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white hover:bg-[#F9FAFB] text-[#1A1A1A] text-sm font-semibold transition-colors">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="h-9 px-4 inline-flex items-center justify-center rounded-[10px] border border-[#E2E8F0] text-sm font-semibold hover:bg-[#F9FAFB] text-[#64748B] hover:text-[#ef5c5c] transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Theme toggle */}
                        <ThemeToggle />

                        {/* Mobile hamburger */}
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Toggle menu"
                            aria-expanded={open}
                            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E2E8F0] hover:bg-[#F9FAFB] transition-colors"
                        >
                            {open ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#ef5c5c]">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#ef5c5c]">
                                    <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile panel */}
                <div className={"md:hidden overflow-hidden transition-[max-height] duration-300 " + (open ? "max-h-[28rem]" : "max-h-0")}>
                    <div className="pb-4 pt-2 border-t border-[#E2E8F0]">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={
                                        "rounded-[10px] px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#F9FAFB] " +
                                        (isActive(link.href) ? "text-[#ef5c5c] bg-[#F9FAFB]" : "text-[#64748B]")
                                    }
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isLoggedIn && (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={() => setOpen(false)}
                                        className="rounded-[10px] px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#F9FAFB] text-[#64748B]"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/cart"
                                        onClick={() => setOpen(false)}
                                        className="rounded-[10px] px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#F9FAFB] text-[#64748B]"
                                    >
                                        Cart
                                    </Link>
                                </>
                            )}

                            <div className="mt-2 flex items-center gap-2">
                                {isLoggedIn ? (
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 h-10 px-3 inline-flex items-center justify-center rounded-[10px] bg-[#ef5c5c] text-white text-sm font-bold hover:bg-[#E53935] transition-colors"
                                    >
                                        Log out
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setOpen(false)}
                                        className="flex-1 h-10 px-3 inline-flex items-center justify-center rounded-[10px] border border-[#E2E8F0] text-sm font-semibold hover:bg-[#F9FAFB] text-[#64748B] transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
