"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ROLES, BOOKING_STATUS } from "@/lib/data";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";
import { ToggleLeft, ToggleRight, Star, Briefcase, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { currentUser, bookings, categories, users, reviews, toggleAvailability, dbLoading } = useApp();

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <div className="w-8 h-8 border-4 border-[#19e65e] border-t-transparent rounded-full animate-spin mr-3" />
        Loading…
      </div>
    );
  }

  if (!currentUser || currentUser.role !== ROLES.PROVIDER) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600 mb-4">Provider access only.</p>
        <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
      </div>
    );
  }

  if (!currentUser.profile?.isApproved) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Pending Approval</h2>
        <p className="text-gray-500">Your provider account is pending admin approval. You&apos;ll receive access once approved.</p>
      </div>
    );
  }

  const myJobs = bookings.filter((b) => b.providerId === currentUser.id);
  const pendingJobs = myJobs.filter((b) => b.status === BOOKING_STATUS.REQUESTED);
  const activeJobs = myJobs.filter((b) => [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.IN_PROGRESS].includes(b.status));
  const completedJobs = myJobs.filter((b) => b.status === BOOKING_STATUS.COMPLETED);
  const myReviews = reviews.filter((r) => r.providerId === currentUser.id && r.isApproved);

  const stats = [
    { label: "Pending Requests", value: pendingJobs.length, icon: <Clock className="w-5 h-5" />, color: "text-yellow-600 bg-yellow-50" },
    { label: "Active Jobs", value: activeJobs.length, icon: <Briefcase className="w-5 h-5" />, color: "text-[#14a84a] bg-[#e8fdf0]" },
    { label: "Completed", value: completedJobs.length, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
    { label: "Rating", value: currentUser.profile.rating > 0 ? `${currentUser.profile.rating}★` : "—", icon: <Star className="w-5 h-5" />, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser.name.split(" ")[0]}!</h1>
          <p className="text-gray-500 text-sm mt-1">{currentUser.city}</p>
        </div>
        <button
          onClick={() => toggleAvailability(currentUser.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            currentUser.profile.isAvailable
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {currentUser.profile.isAvailable
            ? <><ToggleRight className="w-5 h-5" /> Available</>
            : <><ToggleLeft className="w-5 h-5" /> Unavailable</>}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Requests */}
      {pendingJobs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🔔 Pending Requests</h2>
          <div className="space-y-3">
            {pendingJobs.map((job) => {
              const cat = categories.find((c) => c.id === job.categoryId);
              const customer = users.find((u) => u.id === job.customerId);
              return (
                <div key={job.id} className="bg-white rounded-2xl border border-amber-200 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{cat?.icon}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{cat?.name}</p>
                      <p className="text-xs text-gray-500">{customer?.name} • {job.date} at {job.time}</p>
                      <p className="text-xs text-gray-400 truncate">{job.address}</p>
                    </div>
                  </div>
                  <Link href={`/provider/job/${job.id}`}>
                    <Button size="sm">Review</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">⚡ Active Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeJobs.map((job) => {
              const cat = categories.find((c) => c.id === job.categoryId);
              const customer = users.find((u) => u.id === job.customerId);
              return (
                <div key={job.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{cat?.icon}</span>
                      <span className="font-medium text-sm text-gray-900">{cat?.name}</span>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="text-xs text-gray-500">{customer?.name} • {job.date} {job.time}</p>
                  <Link href={`/provider/job/${job.id}`} className="block mt-2">
                    <Button variant="outline" size="sm" className="w-full">Manage Job</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Reviews */}
      {myReviews.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">⭐ Recent Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myReviews.slice(0, 4).map((r) => {
              const customer = users.find((u) => u.id === r.customerId);
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{customer?.name}</p>
                    <div className="flex">{Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < r.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                    ))}</div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{r.comment}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
