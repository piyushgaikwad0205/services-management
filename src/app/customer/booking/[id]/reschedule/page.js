"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { ROLES, BOOKING_STATUS } from "@/lib/data";
import Button from "@/components/Button";
import Input, { Textarea } from "@/components/Input";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RescheduleBookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { bookings, currentUser, updateBooking, dbLoading } = useApp();

  const booking = bookings.find((b) => b.id === id);

  const [form, setForm] = useState({ date: "", time: "", notes: "" });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (booking) setForm({ date: booking.date || "", time: booking.time || "", notes: booking.notes || "" });
  }, [booking?.id]);

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
  if (![BOOKING_STATUS.REQUESTED, BOOKING_STATUS.CONFIRMED].includes(booking.status)) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><p className="text-gray-600">This booking cannot be rescheduled.</p></div>;
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateBooking(booking.id, { date: form.date, time: form.time, notes: form.notes });
    setDone(true);
    setTimeout(() => router.push(`/customer/booking/${id}`), 1500);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reschedule Booking</h1>

      {done ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
          <p className="font-semibold text-gray-900">Booking Rescheduled!</p>
          <p className="text-sm text-gray-500">Redirecting to booking details...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="New Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              min={new Date().toISOString().split("T")[0]}
              required
            />
            <Input
              label="New Time"
              type="time"
              value={form.time}
              onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
              required
            />
          </div>
          <Textarea
            label="Updated Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            rows={3}
            placeholder="Any updates for the provider?"
          />
          <Button type="submit" size="lg" className="w-full">Confirm Reschedule</Button>
        </form>
      )}
    </div>
  );
}
