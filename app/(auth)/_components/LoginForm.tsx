// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { startTransition, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { LoginData, loginSchema } from "../schema";
// import { login as apiLogin } from '../../../lib/api/auth';
// import { setAuthToken } from '../../../lib/api/axios-instance';
// export default function LoginForm() {
//     const router = useRouter();
//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//     } = useForm<LoginData>({
//         resolver: zodResolver(loginSchema),
//         mode: "onSubmit",
//     });
//     const [pending, setTransition] = useTransition()

//     const submit = async (values: LoginData) => {
//         try {
//             const resp = await apiLogin({
//                 email: values.email,
//                 password: values.password,
//             });

//             const formatServerMessage = (m: any) => {
//                 if (!m) return null;
//                 if (typeof m === 'string') return m;
//                 if (Array.isArray(m)) return m.join(', ');
//                 if (typeof m === 'object') {
//                     if (m.message && typeof m.message === 'string') return m.message;
//                     if (m.errors) {
//                         if (Array.isArray(m.errors)) return m.errors.join(', ');
//                         if (typeof m.errors === 'object') return Object.values(m.errors).flat().join(', ');
//                     }
//                     return JSON.stringify(m);
//                 }
//                 return String(m);
//             };

//             // Backend sets httpOnly cookie; rely on `resp.success` and redirect
//             if (resp?.success) {
//                 // store a small client-side flag so header can reflect auth state
//                 try { localStorage.setItem('isLoggedIn', '1'); localStorage.setItem('username', resp?.data?.username || ''); } catch (e) {}
//                 // eslint-disable-next-line no-alert
//                 alert(formatServerMessage(resp?.message) || 'Login successful');
//                 setTransition(() => {
//                     router.push("/dashboard");
//                 });
//             } else {
//                 const serverMsg = formatServerMessage(resp?.message) || 'Login failed';
//                 // eslint-disable-next-line no-alert
//                 alert(serverMsg);
//             }
//         } catch (err: any) {
//             console.error('Login error', err);
//             const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message;
//             const formatted = typeof serverMsg === 'object' ? JSON.stringify(serverMsg) : serverMsg;
//             // eslint-disable-next-line no-alert
//             alert(formatted || 'Login failed');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit(submit)} className="space-y-4">
//             <div className="space-y-1">
//                 <label className="text-sm font-medium" htmlFor="email">Email</label>
//                 <input
//                     id="email"
//                     type="email"
//                     autoComplete="email"
//                     className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
//                     {...register("email")}
//                 />
//                 {errors.email?.message && (
//                     <p className="text-xs text-red-600">{errors.email.message}</p>
//                 )}
//             </div>

//             <div className="space-y-1">
//                 <label className="text-sm font-medium" htmlFor="password">Password</label>
//                 <input
//                     id="password"
//                     type="password"
//                     autoComplete="current-password"
//                     className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
//                     {...register("password")}
//                 />
//                 {errors.password?.message && (
//                     <p className="text-xs text-red-600">{errors.password.message}</p>
//                 )}
//             </div>

//             <button
//                 type="submit"
//                 disabled={isSubmitting || pending}
//                 className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
//             >
//                 { isSubmitting || pending ? "Logging in..." : "Log in"}
//             </button>

            
//         </form>
//     );
// }
