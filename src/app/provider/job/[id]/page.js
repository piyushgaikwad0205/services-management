"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { ROLES, BOOKING_STATUS, STATUS_TRANSITIONS } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/Button";
import { Textarea } from "@/components/Input";
import { ArrowLeft, User, MapPin, Calendar, Clock, IndianRupee, FileText } from "lucide-react";

export default function ProviderJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const { bookings, categories, users, currentUser, updateBookingStatus, updateWorkNotes, dbLoading } = useApp();

  const booking = bookings.find((b) => b.id === id);
  const category = categories.find((c) => c.id === booking?.categoryId);
  const customer = users.find((u) => u.id === booking?.customerId);

  const [workNotes, setWorkNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (booking?.workNotes !== undefined) setWorkNotes(booking.workNotes);
  }, [booking?.workNotes]);

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
  if (!booking || booking.providerId !== currentUser.id) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><p className="text-gray-600">Job not found.</p></div>;
  }

  const allowedTransitions = STATUS_TRANSITIONS[booking.status] || [];

  async function handleStatusChange(newStatus) {
    updateBookingStatus(booking.id, newStatus);
  }

  async function handleSaveNotes() {
    setSaving(true);
    updateWorkNotes(booking.id, workNotes);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job #{booking.id.slice(0, 8)}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl">{category?.icon}</span>
            <span className="text-gray-600 font-medium">{category?.name}</span>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-[#14a84a]" /> Customer Details
        </h2>
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-900">{customer?.name}</p>
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
            <span>{booking.address}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-400" />{booking.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" />{booking.time}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <IndianRupee className="w-4 h-4 text-gray-400" />₹{booking.price?.toLocaleString()}
          </div>
          {booking.notes && (
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-start gap-2">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-gray-600 italic">&ldquo;{booking.notes}&rdquo;</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Actions */}
      {allowedTransitions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Update Job Status</h2>
          <div className="flex flex-wrap gap-2">
            {allowedTransitions.map((status) => {
              const config = {
                [BOOKING_STATUS.CONFIRMED]: { label: "✅ Accept Job", variant: "success" },
                [BOOKING_STATUS.IN_PROGRESS]: { label: "🚀 Start Job", variant: "primary" },
                [BOOKING_STATUS.COMPLETED]: { label: "🎉 Mark Complete", variant: "success" },
                [BOOKING_STATUS.CANCELLED]: { label: "✕ Reject", variant: "danger" },
              };
              const cfg = config[status] || { label: status, variant: "secondary" };
              return (
                <Button
                  key={status}
                  variant={cfg.variant}
                  onClick={() => handleStatusChange(status)}
                >
                  {cfg.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Work Notes */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Work Notes</h2>
        <Textarea
          value={workNotes}
          onChange={(e) => setWorkNotes(e.target.value)}
          rows={4}
          placeholder="Add notes about the work done, materials used, issues found..."
        />
        <div className="flex items-center gap-3 mt-3">
          <Button onClick={handleSaveNotes} disabled={saving} variant="secondary">
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Notes"}
          </Button>
          {saved && <span className="text-sm text-green-600">Notes saved successfully</span>}
        </div>
      </div>
    </div>
  );
}
