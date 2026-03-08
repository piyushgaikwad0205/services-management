"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/data";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { User, Wrench } from "lucide-react";

export default function RegisterPage() {
  const { register, registerError, currentUser } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: ROLES.CUSTOMER, city: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === ROLES.ADMIN) router.replace("/admin/dashboard");
      else if (currentUser.role === ROLES.PROVIDER) router.replace("/provider/dashboard");
      else router.replace("/");
    }
  }, [currentUser, router]);

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await register(form);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#19e65e] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-extrabold text-xl">SB</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join ServBook today — it&apos;s free</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@example.com" required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Minimum 6 characters" required minLength={6} />
            <Input label="City" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Mumbai, Delhi" required />

            {/* Role selector */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">I want to…</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { role: ROLES.CUSTOMER, label: "Book Services", sub: "As a Customer", icon: <User className="w-5 h-5" /> },
                  { role: ROLES.PROVIDER, label: "Offer Services", sub: "As a Provider", icon: <Wrench className="w-5 h-5" /> },
                ].map((opt) => (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => set("role", opt.role)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                      form.role === opt.role
                        ? "border-[#19e65e] bg-[#e8fdf0] text-[#14a84a]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {opt.icon}
                    <span className="text-sm font-semibold">{opt.label}</span>
                    <span className="text-xs">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {form.role === ROLES.PROVIDER && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                ⚠️ Provider accounts require admin approval before accepting bookings.
              </div>
            )}

            {registerError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {registerError}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#14a84a] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
