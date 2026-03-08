"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ROLES, BOOKING_STATUS } from "@/lib/data";
import BookingCard from "@/components/BookingCard";
import Button from "@/components/Button";

const TABS = ["All", BOOKING_STATUS.REQUESTED, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED];

export default function ProviderJobsPage() {
  const router = useRouter();
  const { bookings, categories, users, currentUser, dbLoading } = useApp();
  const [activeTab, setActiveTab] = useState("All");

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <div className="w-8 h-8 border-4 border-[#19e65e] border-t-transparent rounded-full animate-spin mr-3" />
        Loading…
      </div>
    );
  }

  if (!currentUser || currentUser.role !== ROLES.PROVIDER) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><Button onClick={() => router.push("/auth/login")}>Sign In</Button></div>;
  }

  const myJobs = bookings
    .filter((b) => b.providerId === currentUser.id)
    .filter((b) => activeTab === "All" || b.status === activeTab)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
        <p className="text-gray-500 text-sm mt-1">{bookings.filter((b) => b.providerId === currentUser.id).length} total jobs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {TABS.map((t) => {
          const count = t === "All"
            ? bookings.filter((b) => b.providerId === currentUser.id).length
            : bookings.filter((b) => b.providerId === currentUser.id && b.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                activeTab === t ? "bg-[#19e65e] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t} {count > 0 && <span className="ml-1 text-xs opacity-75">({count})</span>}
            </button>
          );
        })}
      </div>

      {myJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-4xl mb-3">💼</div>
          <h3 className="font-semibold text-gray-900 mb-1">No jobs yet</h3>
          <p className="text-gray-500 text-sm">Jobs will appear here once customers book your services</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myJobs.map((job) => {
            const cat = categories.find((c) => c.id === job.categoryId);
            const customer = users.find((u) => u.id === job.customerId);
            return (
              <BookingCard
                key={job.id}
                booking={job}
                category={cat}
                customer={customer}
                actions={
                  <Link href={`/provider/job/${job.id}`}>
                    <Button variant="secondary" size="sm">Manage Job</Button>
                  </Link>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
