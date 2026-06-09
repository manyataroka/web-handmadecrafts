"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-2xl font-semibold mb-4 text-[#ef5c5c]">Dashboard</h1>
        <p className="mb-4">{username ? `Welcome, ${username}` : 'Welcome to your dashboard'}</p>
        <button onClick={logout} className="px-4 py-2 rounded bg-foreground text-background">Log out</button>
      </div>
    </div>
  );
}
