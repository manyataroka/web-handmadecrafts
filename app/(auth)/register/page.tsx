"use client";
import Link from "next/link";
import Image from "next/image";
import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[680px] text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-orange-200">
            <Image src="/images/Image1.jpg" alt="Logo" width={80} height={80} className="object-cover w-full h-full" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-[#ef5c5c]">Register</h2>
          <div className="w-16 h-[3px] bg-[#ef5c5c] rounded-full mt-2"></div>
        </div>

        <div className="space-y-4">
          <RegisterForm />

          <p className="text-[#64748B] text-sm">
            Already have an account? {" "}
            <Link href="/login" className="font-bold text-[#ef5c5c]">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}