"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/data";
import Button from "@/components/Button";
import StarRating from "@/components/StarRating";
import { CheckCircle2, XCircle } from "lucide-react";

export default function AdminReviewsPage() {
  const router = useRouter();
  const { currentUser, reviews, users, bookings, categories, approveReview, rejectReview, dbLoading } = useApp();
  const [tab, setTab] = useState("pending");

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <div className="w-8 h-8 border-4 border-[#19e65e] border-t-transparent rounded-full animate-spin mr-3" />
        Loading…
      </div>
    );
  }

  if (!currentUser || currentUser.role !== ROLES.ADMIN) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><Button onClick={() => router.push("/auth/login")}>Sign In</Button></div>;
  }

  const pendingReviews = reviews.filter((r) => !r.isApproved);
  const approvedReviews = reviews.filter((r) => r.isApproved);
  const displayReviews = tab === "pending" ? pendingReviews : approvedReviews;

  function ReviewCard({ review }) {
    const customer = users.find((u) => u.id === review.customerId);
    const provider = users.find((u) => u.id === review.providerId);
    const booking = bookings.find((b) => b.id === review.bookingId);
    const category = categories.find((c) => c.id === booking?.categoryId);
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#e8fdf0] rounded-full flex items-center justify-center text-[#14a84a] font-bold text-sm">
                {customer?.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{customer?.name}</p>
                <p className="text-xs text-gray-500">for {provider?.name} • {category?.name}</p>
              </div>
            </div>
          </div>
          <StarRating value={review.rating} />
        </div>
        <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2 mb-4 italic">
          &ldquo;{review.comment}&rdquo;
        </p>
        <p className="text-xs text-gray-400 mb-3">{new Date(review.createdAt).toLocaleDateString()}</p>

        {tab === "pending" && (
          <div className="flex gap-2">
            <Button
              variant="success"
              size="sm"
              className="flex-1"
              onClick={() => approveReview(review.id)}
            >
              <CheckCircle2 className="w-4 h-4" /> Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="flex-1"
              onClick={() => { if (confirm("Remove this review?")) rejectReview(review.id); }}
            >
              <XCircle className="w-4 h-4" /> Remove
            </Button>
          </div>
        )}
        {tab === "approved" && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => { if (confirm("Remove this review?")) rejectReview(review.id); }}
          >
            <XCircle className="w-4 h-4" /> Remove
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Review Moderation</h1>
        <p className="text-gray-500 text-sm mt-1">{reviews.length} total reviews</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {[
          { key: "pending", label: `Pending (${pendingReviews.length})` },
          { key: "approved", label: `Approved (${approvedReviews.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === t.key ? "bg-[#19e65e] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {displayReviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-4xl mb-3">⭐</div>
          <h3 className="font-semibold text-gray-900 mb-1">No {tab} reviews</h3>
          <p className="text-gray-500 text-sm">
            {tab === "pending" ? "All reviews have been moderated" : "No reviews approved yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}
    </div>
  );
}
