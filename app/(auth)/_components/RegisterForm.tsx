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
            // try common shapes
            if (m.message && typeof m.message === 'string') return m.message;
            if (m.errors) {
                if (Array.isArray(m.errors)) return m.errors.join(', ');
                if (typeof m.errors === 'object') return Object.values(m.errors).flat().join(', ');
            }
            // last resort
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
            // show a clear success message then redirect
            // eslint-disable-next-line no-alert
            alert(successMsg);
            setTransition(() => {
                router.push("/login");
            });
        } catch (err: any) {
            console.error('Registration error', err);
            const serverMsg = formatServerMessage(err?.response?.data?.message || err?.response?.data || err?.message);
            // eslint-disable-next-line no-alert
            alert(serverMsg || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-medium text-black" htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("username")}
                />
                {errors.username?.message && (
                    <p className="text-xs text-red-600">{errors.username.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("email")}
                />
                {errors.email?.message && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("password")}
                />
                {errors.password?.message && (
                    <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword?.message && (
                    <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
                { isSubmitting || pending ? "Signing up..." : "Signup"}
            </button>

            
        </form>
    );
}
