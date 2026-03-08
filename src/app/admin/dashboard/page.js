"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ROLES, BOOKING_STATUS } from "@/lib/data";
import Button from "@/components/Button";
import { Users, Layers, MessageSquare, CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentUser, users, bookings, categories, reviews, dbLoading } = useApp();

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <div className="w-8 h-8 border-4 border-[#19e65e] border-t-transparent rounded-full animate-spin mr-3" />
        Loading…
      </div>
    );
  }

  if (!currentUser || currentUser.role !== ROLES.ADMIN) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600 mb-4">Admin access required.</p>
        <Button onClick={() => router.push("/auth/login")}>Sign In as Admin</Button>
      </div>
    );
  }

  const pendingProviders = users.filter((u) => u.role === ROLES.PROVIDER && !u.profile?.isApproved);
  const approvedProviders = users.filter((u) => u.role === ROLES.PROVIDER && u.profile?.isApproved);
  const customers = users.filter((u) => u.role === ROLES.CUSTOMER);
  const pendingReviews = reviews.filter((r) => !r.isApproved);
  const completedBookings = bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED);
  const activeBookings = bookings.filter((b) => [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.IN_PROGRESS].includes(b.status));

  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);

  const stats = [
    { label: "Total Customers", value: customers.length, icon: <Users className="w-5 h-5" />, color: "text-[#14a84a] bg-[#e8fdf0]", href: null },
    { label: "Approved Providers", value: approvedProviders.length, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-600 bg-green-50", href: "/admin/providers" },
    { label: "Pending Approvals", value: pendingProviders.length, icon: <Clock className="w-5 h-5" />, color: "text-amber-600 bg-amber-50", href: "/admin/providers" },
    { label: "Active Bookings", value: activeBookings.length, icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-600 bg-purple-50", href: null },
    { label: "Service Categories", value: categories.length, icon: <Layers className="w-5 h-5" />, color: "text-[#14a84a] bg-[#e8fdf0]", href: "/admin/categories" },
    { label: "Pending Reviews", value: pendingReviews.length, icon: <MessageSquare className="w-5 h-5" />, color: "text-rose-600 bg-rose-50", href: "/admin/reviews" },
    { label: "Completed Jobs", value: completedBookings.length, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-teal-600 bg-teal-50", href: null },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-600 bg-emerald-50", href: null },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of the ServBook platform</p>
      </div>

      {/* Alert for pending items */}
      {(pendingProviders.length > 0 || pendingReviews.length > 0) && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800">Action Required</p>
            <p className="text-amber-700">
              {pendingProviders.length > 0 && `${pendingProviders.length} provider(s) waiting for approval. `}
              {pendingReviews.length > 0 && `${pendingReviews.length} review(s) to moderate.`}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            {pendingProviders.length > 0 && (
              <Link href="/admin/providers"><Button size="sm">Review Providers</Button></Link>
            )}
            {pendingReviews.length > 0 && (
              <Link href="/admin/reviews"><Button size="sm" variant="secondary">Moderate Reviews</Button></Link>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl border border-gray-200 p-5 ${s.href ? "hover:shadow-md transition cursor-pointer" : ""}`}
            onClick={() => s.href && router.push(s.href)}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Manage Providers", desc: "Approve or reject service provider applications", href: "/admin/providers", icon: "👷", color: "from-[#19e65e] to-[#14c750]" },
          { title: "Service Categories", desc: "Add, edit, or remove service categories", href: "/admin/categories", icon: "🗂️", color: "from-purple-500 to-purple-600" },
          { title: "Moderate Reviews", desc: "Approve or reject customer reviews", href: "/admin/reviews", icon: "⭐", color: "from-amber-500 to-orange-500" },
        ].map((card) => (
          <Link key={card.href} href={card.href}>
            <div className={`bg-linear-to-br ${card.color} rounded-2xl p-5 text-white hover:shadow-lg transition-shadow cursor-pointer`}>
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-bold mb-1">{card.title}</h3>
              <p className="text-sm text-white/80">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-medium text-gray-500">Service</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Customer</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Provider</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.slice(-8).reverse().map((b) => {
                const cat = categories.find((c) => c.id === b.categoryId);
                const customer = users.find((u) => u.id === b.customerId);
                const provider = users.find((u) => u.id === b.providerId);
                const statusColors = { Requested: "text-yellow-700 bg-yellow-50", Confirmed: "text-[#14a84a] bg-[#e8fdf0]", "In-progress": "text-purple-700 bg-purple-50", Completed: "text-green-700 bg-green-50", Cancelled: "text-red-700 bg-red-50" };
                return (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">{cat?.icon} {cat?.name}</td>
                    <td className="px-5 py-3 text-gray-600">{customer?.name}</td>
                    <td className="px-5 py-3 text-gray-600">{provider?.name}</td>
                    <td className="px-5 py-3 text-gray-500">{b.date}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || "bg-gray-100 text-gray-600"}`}>{b.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">₹{b.price?.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
