"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem('username');
      setUsername(u);
    } catch (e) {
      setUsername(null);
    }
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
    } catch (e) {}
    router.push('/');
  };

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg text-foreground/70 mb-8">{username ? `Welcome back, ${username}!` : 'Welcome to your dashboard'}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/profile" className="p-6 rounded-lg border border-black/10 dark:border-white/10 hover:bg-foreground/5 transition-colors">
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p className="text-sm text-foreground/60">View and edit your profile information</p>
          </Link>
          <div className="p-6 rounded-lg border border-black/10 dark:border-white/10 hover:bg-foreground/5 transition-colors">
            <h3 className="text-xl font-semibold mb-2">Settings</h3>
            <p className="text-sm text-foreground/60">Manage your account settings</p>
          </div>
          <div className="p-6 rounded-lg border border-black/10 dark:border-white/10 hover:bg-foreground/5 transition-colors">
            <h3 className="text-xl font-semibold mb-2">Activity</h3>
            <p className="text-sm text-foreground/60">View your recent activity</p>
          </div>
        </div>
        <button onClick={logout} className="mt-8 h-10 px-6 inline-flex items-center justify-center rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity">
          Log out
        </button>
      </div>
    </div>
  );
}
