"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ROLES, BOOKING_STATUS } from "@/lib/data";
import ReviewForm from "@/components/ReviewForm";
import Button from "@/components/Button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { bookings, categories, reviews, currentUser, addReview, dbLoading } = useApp();
  const [done, setDone] = useState(false);

  const booking = bookings.find((b) => b.id === id);
  const category = categories.find((c) => c.id === booking?.categoryId);
  const alreadyReviewed = reviews.some((r) => r.bookingId === id);

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <div className="w-8 h-8 border-4 border-[#19e65e] border-t-transparent rounded-full animate-spin mr-3" />
        Loading…
      </div>
    );
  }

  if (!currentUser || currentUser.role !== ROLES.CUSTOMER) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><Button onClick={() => router.push("/auth/login")}>Sign In</Button></div>;
  }
  if (!booking || booking.customerId !== currentUser.id) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><p className="text-gray-600">Booking not found.</p></div>;
  }
  if (booking.status !== BOOKING_STATUS.COMPLETED) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><p className="text-gray-600">You can only review completed bookings.</p></div>;
  }
  if (alreadyReviewed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="font-semibold text-gray-900">Already Reviewed</p>
        <p className="text-gray-500 text-sm mt-1">You have already submitted a review for this booking.</p>
        <Button className="mt-4" onClick={() => router.push("/customer/bookings")}>Back to Bookings</Button>
      </div>
    );
  }

  function handleSubmit({ rating, comment }) {
    addReview({
      bookingId: id,
      customerId: currentUser.id,
      providerId: booking.providerId,
      rating,
      comment,
    });
    setDone(true);
    setTimeout(() => router.push("/customer/bookings"), 1500);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Leave a Review</h1>
      <p className="text-gray-500 text-sm mb-6">
        Rate your experience for <span className="font-medium text-gray-700">{category?.name}</span> service
      </p>

      {done ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
          <p className="font-semibold text-gray-900">Review Submitted!</p>
          <p className="text-sm text-gray-500">Thank you for your feedback.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <ReviewForm onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
