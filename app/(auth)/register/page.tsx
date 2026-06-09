"use client";
import Link from "next/link";
import Image from "next/image";
import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 via-rose-50 to-rose-200 flex items-center justify-center px-4">
      <div className="w-full max-w-[680px] text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image src="/images/Image1.jpg" alt="Logo" width={80} height={80} className="object-cover w-full h-full" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-[#ef5c5c]">Register</h2>
          <div className="w-16 h-[3px] bg-[#ef5c5c] rounded-full mt-2"></div>
        </div>

        <div className="space-y-4">
          <RegisterForm />

          <p className="text-gray-500 text-sm">
            Already have an account? {" "}
            <Link href="/login" className="font-semibold text-[#ef5c5c]">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}