"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 via-rose-50 to-rose-200 flex items-center justify-center px-4">
      <div className="w-full max-w-[680px] text-center">
        <div className="mb-8 flex flex-col items-center">
          {/* Logo */}
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image src="/images/Image1.jpg" alt="Logo" width={80} height={80} className="object-cover w-full h-full" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-gray-700">Register</h2>
          <div className="w-16 h-[3px] bg-[#ef5c5c] rounded-full mt-2"></div>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div className="bg-white rounded-lg px-5 py-4 flex items-center shadow-sm">
            <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Username" className="w-full outline-none text-gray-600 text-sm bg-transparent" />
          </div>

          {/* Email */}
          <div className="bg-white rounded-lg px-5 py-4 flex items-center shadow-sm">
            <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 7 10-7" strokeLinecap="round" />
            </svg>
            <input type="email" placeholder="Email Address" className="w-full outline-none text-gray-600 text-sm bg-transparent" />
          </div>

          {/* Password */}
          <div className="bg-gray-100 rounded-lg px-5 py-4 flex items-center shadow-sm">
            <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
            </svg>
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full outline-none text-gray-600 text-sm bg-transparent" />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm text-gray-500 px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-red-400" />
              Remember me
            </label>
            <button className="font-medium text-gray-700 hover:text-[#ef5c5c] transition-colors">Forgot password?</button>
          </div>

          <button className="w-full bg-[#ef5c5c] hover:bg-[#e24d4d] transition text-white font-bold tracking-widest py-4 rounded-lg">REGISTER</button>

          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-gray-700 hover:text-[#ef5c5c]">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}