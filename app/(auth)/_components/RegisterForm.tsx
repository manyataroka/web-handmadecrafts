"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterData, registerSchema } from "../schema";
import { register as apiRegister } from '../../../lib/api/auth';
import { useTransition } from "react";
import { useRouter } from "next/navigation";


export default function RegisterForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const [pending, setTransition] = useTransition()

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

    const submit = async (values: RegisterData) => {
        try {
            const resp = await apiRegister({
                username: values.username,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
            });
            const successMsg = formatServerMessage(resp?.message) || 'Registration successful';
            alert(successMsg);
            setTransition(() => {
                router.push("/login");
            });
        } catch (err: any) {
            console.error('Registration error', err);
            const serverMsg = formatServerMessage(err?.response?.data?.message || err?.response?.data || err?.message);
            alert(serverMsg || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-medium text-black text-center block" htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    className="h-11 w-full rounded-lg border border-orange-200 bg-[#FCEAEA] px-4 text-base outline-none focus:border-[#ef5c5c] focus:ring-0"
                    {...register("username")}
                />
                {errors.username?.message && (
                    <p className="text-xs text-red-600 text-left">{errors.username.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-black text-center block" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-11 w-full rounded-lg border border-orange-200 bg-[#FCEAEA] px-4 text-base outline-none focus:border-[#ef5c5c] focus:ring-0"
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
                    autoComplete="new-password"
                    className="h-11 w-full rounded-lg border border-orange-200 bg-[#FCEAEA] px-4 text-base outline-none focus:border-[#ef5c5c] focus:ring-0"
                    {...register("password")}
                />
                {errors.password?.message && (
                    <p className="text-xs text-red-600 text-left">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-black text-center block" htmlFor="confirmPassword">Confirm password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-lg border border-orange-200 bg-[#FCEAEA] px-4 text-base outline-none focus:border-[#ef5c5c] focus:ring-0"
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword?.message && (
                    <p className="text-xs text-red-600 text-left">{errors.confirmPassword.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-11 w-full rounded-lg bg-[#ef5c5c] text-white text-lg font-bold hover:bg-[#E53935] disabled:opacity-60 transition-colors"
            >
                {isSubmitting || pending ? "Signing up..." : "Sign up"}
            </button>
        </form>
    );
}
