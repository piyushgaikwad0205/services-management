"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ROLES, BOOKING_STATUS } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/Button";
import StarRating from "@/components/StarRating";
import { ArrowLeft, Calendar, Clock, MapPin, IndianRupee, User, FileText } from "lucide-react";

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { bookings, categories, users, currentUser, updateBookingStatus, reviews, dbLoading } = useApp();

  const booking = bookings.find((b) => b.id === id);
  const category = categories.find((c) => c.id === booking?.categoryId);
  const provider = users.find((u) => u.id === booking?.providerId);
  const review = reviews.find((r) => r.bookingId === id);

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <div className="w-8 h-8 border-4 border-[#19e65e] border-t-transparent rounded-full animate-spin mr-3" />
        Loading…
      </div>
    );
  }

  if (!currentUser) return <div className="max-w-xl mx-auto px-4 py-20 text-center"><Button onClick={() => router.push("/auth/login")}>Sign In</Button></div>;
  if (!booking) return <div className="max-w-xl mx-auto px-4 py-20 text-center"><p className="text-gray-600">Booking not found.</p></div>;

  const isOwner = booking.customerId === currentUser.id || booking.providerId === currentUser.id || currentUser.role === ROLES.ADMIN;
  if (!isOwner) return <div className="max-w-xl mx-auto px-4 py-20 text-center"><p className="text-gray-600">Access denied.</p></div>;

  const canCancel = currentUser.role === ROLES.CUSTOMER &&
    [BOOKING_STATUS.REQUESTED, BOOKING_STATUS.CONFIRMED].includes(booking.status);

  // Status timeline
  const allStatuses = [BOOKING_STATUS.REQUESTED, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.COMPLETED];
  const currentIdx = allStatuses.indexOf(booking.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-500 text-sm mt-1">#{booking.id}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Status Timeline */}
      {booking.status !== BOOKING_STATUS.CANCELLED && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-4">Job Progress</p>
          <div className="flex items-center">
            {allStatuses.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < currentIdx ? "bg-green-500 text-white"
                    : i === currentIdx ? "bg-[#19e65e] text-white ring-4 ring-[#19e65e]/20"
                    : "bg-gray-200 text-gray-400"
                  }`}>
                    {i < currentIdx ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs mt-1 text-center w-16 ${i === currentIdx ? "text-[#14a84a] font-medium" : "text-gray-400"}`}>
                    {s}
                  </span>
                </div>
                {i < allStatuses.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < currentIdx ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{category?.icon}</span>
          <div>
            <h2 className="font-semibold text-gray-900">{category?.name}</h2>
            {provider && (
              <p className="text-sm text-gray-500">Provider: {provider.name}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { icon: <Calendar className="w-4 h-4" />, label: "Date", value: booking.date },
            { icon: <Clock className="w-4 h-4" />, label: "Time", value: booking.time },
            { icon: <MapPin className="w-4 h-4" />, label: "Address", value: booking.address, full: true },
            { icon: <IndianRupee className="w-4 h-4" />, label: "Price", value: `₹${booking.price?.toLocaleString()}` },
          ].map((r) => (
            <div key={r.label} className={`flex items-start gap-2 ${r.full ? "col-span-2" : ""}`}>
              <span className="text-gray-400 mt-0.5">{r.icon}</span>
              <div>
                <p className="text-xs text-gray-400">{r.label}</p>
                <p className="text-gray-700">{r.value}</p>
              </div>
            </div>
          ))}
        </div>
        {booking.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2 text-sm">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400">Customer Notes</p>
              <p className="text-gray-700">{booking.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Work Notes (provider) */}
      {booking.workNotes && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-[#14a84a]" /> Provider Notes
          </h3>
          <p className="text-sm text-gray-600">{booking.workNotes}</p>
        </div>
      )}

      {/* Review */}
      {review && (
        <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Your Review</h3>
          <StarRating value={review.rating} />
          <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {canCancel && (
          <Button
            variant="danger"
            onClick={() => { updateBookingStatus(booking.id, BOOKING_STATUS.CANCELLED); router.push("/customer/bookings"); }}
          >
            Cancel Booking
          </Button>
        )}
        {currentUser.role === ROLES.CUSTOMER &&
          [BOOKING_STATUS.REQUESTED, BOOKING_STATUS.CONFIRMED].includes(booking.status) && (
            <Link href={`/customer/booking/${booking.id}/reschedule`}>
              <Button variant="outline">Reschedule</Button>
            </Link>
          )}
        {currentUser.role === ROLES.CUSTOMER &&
          booking.status === BOOKING_STATUS.COMPLETED && !review && (
            <Link href={`/customer/booking/${booking.id}/review`}>
              <Button variant="success">Leave a Review</Button>
            </Link>
          )}
      </div>
    </div>
  );
}
