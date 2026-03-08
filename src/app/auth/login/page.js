"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/data";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const { login, loginError, currentUser } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === ROLES.ADMIN) router.replace("/admin/dashboard");
      else if (currentUser.role === ROLES.PROVIDER) router.replace("/provider/dashboard");
      else router.replace("/");
    }
  }, [currentUser, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await login(form.email, form.password);
    setLoading(false);
  }

  const demoAccounts = [
    { label: "Customer", email: "rahul@example.com", password: "password" },
    { label: "Provider", email: "amit@example.com", password: "password" },
    { label: "Admin", email: "admin@example.com", password: "admin" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#19e65e] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-extrabold text-xl">SB</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your ServBook account</p>
        </div>

        {/* Demo quick-login */}
        <div className="mb-5 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#19e65e]" /> Quick Demo Login
          </p>
          <div className="flex flex-wrap gap-2">
            {demoAccounts.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => setForm({ email: a.email, password: a.password })}
                className="px-3 py-1.5 text-xs font-semibold border-2 border-[#19e65e] text-[#14a84a] rounded-xl hover:bg-[#e8fdf0] transition"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="email@example.com" required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Your password" required />

            {loginError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {loginError}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[#14a84a] font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
