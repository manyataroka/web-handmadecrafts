"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { login as apiLogin } from '../../../lib/api/auth';
import { setAuthToken } from '../../../lib/api/axios-instance';

export default function LoginForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });
    const [pending, setTransition] = useTransition()

    useEffect(() => {
        try {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn');
            if (isLoggedIn) {
                const isAdmin = sessionStorage.getItem('isAdmin');
                router.replace(isAdmin === '1' ? '/admin' : '/');
            }
        } catch (e) {
            // ignore
        }
    }, [router]);

    const submit = async (values: LoginData) => {
        try {
            const resp = await apiLogin({
                email: values.email,
                password: values.password,
            });

            const formatServerMessage = (m: any) => {
                if (!m) return null;
                if (typeof m === 'string') return m;
                if (Array.isArray(m)) return m.join(', ');
                if (typeof m === 'object') {
                    if (m.message && typeof m.message === 'string') return m.message;
                    if (m.errors) {
                        if (Array.isArray(m.errors)) return m.errors.join(', ');
                        if (typeof m.errors === 'object') return Object.values(m.errors).flat().join(', ');
                    }
                    return JSON.stringify(m);
                }
                return String(m);
            };

            if (resp?.success) {
                const userRole = resp?.data?.role || resp?.data?.user?.role;
                const emailLower = values.email.toLowerCase().trim();
                const isAdminUser =
                    (userRole && String(userRole).toLowerCase() === 'admin') ||
                    emailLower.startsWith('admin@') ||
                    emailLower === 'admin';

                try {
                    sessionStorage.setItem('isLoggedIn', '1');
                    const usernameVal = resp?.data?.username || resp?.data?.user?.username || '';
                    sessionStorage.setItem('username', usernameVal);
                    const tokenVal = resp?.data?.token || resp?.data?.user?.token;
                    if (tokenVal) {
                        sessionStorage.setItem('token', tokenVal);
                        setAuthToken(tokenVal);
                    }
                    if (isAdminUser) {
                        sessionStorage.setItem('isAdmin', '1');
                    } else {
                        sessionStorage.removeItem('isAdmin');
                    }
                    try {
                        window.dispatchEvent(new CustomEvent('auth-changed'));
                    } catch (_) {}
                } catch (e) {}
                alert(formatServerMessage(resp?.message) || 'Login successful');
                setTransition(() => {
                    router.replace(isAdminUser ? "/admin" : "/");
                });
            } else {
                const serverMsg = formatServerMessage(resp?.message) || 'Login failed';
                alert(serverMsg);
            }
        } catch (err: any) {
            console.error('Login error', err);
            const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message;
            const formatted = typeof serverMsg === 'object' ? JSON.stringify(serverMsg) : serverMsg;
            alert(formatted || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-medium text-black text-center block" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-11 w-full rounded-lg border border-[#ffcdd2] bg-[#FCEAEA] px-4 text-base outline-none focus:border-[#ef5c5c] focus:ring-0"
                    {...register("email")}
                />
                {errors.email?.message && (
                    <p className="text-xs text-red-600 text-left">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-black text-center block" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="h-11 w-full rounded-lg border border-[#ffcdd2] bg-[#FCEAEA] px-4 text-base outline-none focus:border-[#ef5c5c] focus:ring-0"
                    {...register("password")}
                />
                {errors.password?.message && (
                    <p className="text-xs text-red-600 text-left">{errors.password.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-11 w-full rounded-lg bg-[#ef5c5c] text-white text-lg font-bold hover:bg-[#E53935] disabled:opacity-60 transition-colors"
            >
                {isSubmitting || pending ? "Logging in..." : "Log in"}
            </button>

            <div className="text-center">
                <Link href="/forget-password" className="text-sm text-[#ef5c5c] hover:text-[#E53935] font-medium">
                    Forgot Password?
                </Link>
            </div>
        </form>
    );
}
