// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ForgotPasswordData, forgotPasswordSchema } from "../schema";
// import { resetPassword as apiResetPassword } from '../../../lib/api/auth';
// import { useTransition } from "react";
// import { useRouter } from "next/navigation";

// export default function ForgotPasswordForm() {
//     const router = useRouter();
//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//     } = useForm<ForgotPasswordData>({
//         resolver: zodResolver(forgotPasswordSchema),
//         mode: "onSubmit",
//     });

//     const [pending, setTransition] = useTransition()

//     const formatServerMessage = (m: any) => {
//         if (!m) return null;
//         if (typeof m === 'string') return m;
//         if (Array.isArray(m)) return m.join(', ');
//         if (typeof m === 'object') {
//             if (m.message && typeof m.message === 'string') return m.message;
//             if (m.errors) {
//                 if (Array.isArray(m.errors)) return m.errors.join(', ');
//                 if (typeof m.errors === 'object') return Object.values(m.errors).flat().join(', ');
//             }
//             return JSON.stringify(m);
//         }
//         return String(m);
//     };

//     const submit = async (values: ForgotPasswordData) => {
//         try {
//             const resp = await apiResetPassword({
//                 newPassword: values.newPassword,
//                 confirmPassword: values.confirmPassword,
//             });
//             const successMsg = formatServerMessage(resp?.message) || 'Password reset successful';
//             alert(successMsg);
//             setTransition(() => {
//                 router.push("/login");
//             });
//         } catch (err: any) {
//             console.error('Reset password error', err);
//             const serverMsg = formatServerMessage(err?.response?.data?.message || err?.response?.data || err?.message);
//             alert(serverMsg || 'Password reset failed');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit(submit)} className="space-y-4">
//             <div className="space-y-1">
//                 <label className="text-sm font-medium text-black text-center block" htmlFor="newPassword">New Password</label>
//                 <input
//                     id="newPassword"
//                     type="password"
//                     autoComplete="new-password"
//                     className="h-11 w-full rounded-lg border border-orange-200 bg-[#FCEAEA] px-4 text-base outline-none focus:border-[#ef5c5c] focus:ring-0"
//                     {...register("newPassword")}
//                 />
//                 {errors.newPassword?.message && (
//                     <p className="text-xs text-red-600 text-left">{errors.newPassword.message}</p>
//                 )}
//             </div>

//             <div className="space-y-1">
//                 <label className="text-sm font-medium text-black text-center block" htmlFor="confirmPassword">Confirm Password</label>
//                 <input
//                     id="confirmPassword"
//                     type="password"
//                     autoComplete="new-password"
//                     className="h-11 w-full rounded-lg border border-orange-200 bg-[#FCEAEA] px-4 text-base outline-none focus:border-[#ef5c5c] focus:ring-0"
//                     {...register("confirmPassword")}
//                 />
//                 {errors.confirmPassword?.message && (
//                     <p className="text-xs text-red-600 text-left">{errors.confirmPassword.message}</p>
//                 )}
//             </div>

//             <button
//                 type="submit"
//                 disabled={isSubmitting || pending}
//                 className="h-11 w-full rounded-lg bg-[#ef5c5c] text-white text-lg font-bold hover:bg-[#E53935] disabled:opacity-60 transition-colors"
//             >
//                 {isSubmitting || pending ? "Resetting..." : "Reset Password"}
//             </button>
//         </form>
//     );
// }

