"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SKELETON = (
    <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#ef5c5c] border-t-transparent rounded-full animate-spin" />
    </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const didRun = useRef(false);

  useEffect(() => {
    setMounted(true);

    if (didRun.current) return;
    didRun.current = true;

    let ok = false;
    try {
        ok = !!sessionStorage.getItem('isLoggedIn');
        if (ok) setUsername(sessionStorage.getItem('username'));
    } catch (_) {
        ok = false;
    }

    if (!ok) {
        const t = window.setTimeout(() => {
            window.location.href = '/login';
        }, 0);
        return () => window.clearTimeout(t);
    }
    return undefined;
  }, [router]);

  if (!mounted) {
    return SKELETON;
  }

  const logout = () => {
    try {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('isAdmin');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('token');
    } catch (_e) {}
    try {
      window.dispatchEvent(new CustomEvent('auth-changed'));
    } catch (_) {}
    router.push('/');
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-rose-100 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#E53935]">Dashboard</h1>
        <p className="text-lg text-black/70 mb-8">{username ? `Welcome back, ${username}!` : 'Welcome to your dashboard'}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/profile" className="bg-white/85 p-6 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow text-left">
            <h3 className="text-xl font-semibold mb-2 text-black">Profile</h3>
            <p className="text-sm text-black/60">View and edit your profile information</p>
          </Link>
          <div className="bg-white/85 p-6 rounded-2xl shadow-sm border border-black/5 text-left">
            <h3 className="text-xl font-semibold mb-2 text-black">Settings</h3>
            <p className="text-sm text-black/60">Manage your account settings</p>
          </div>
          <div className="bg-white/85 p-6 rounded-2xl shadow-sm border border-black/5 text-left">
            <h3 className="text-xl font-semibold mb-2 text-black">Activity</h3>
            <p className="text-sm text-black/60">View your recent activity</p>
          </div>
        </div>
        <button onClick={logout} className="mt-8 h-10 px-6 inline-flex items-center justify-center rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity">
          Log out
        </button>
      </div>
    </div>
  );
}
