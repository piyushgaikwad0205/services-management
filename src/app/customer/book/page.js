"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/data";
import Button from "@/components/Button";
import Input, { Textarea, Select } from "@/components/Input";
import { IndianRupee, Calendar, Clock, MapPin, FileText, ArrowLeft } from "lucide-react";

function BookPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories, users, currentUser, createBooking, dbLoading } = useApp();

  const providerId = searchParams.get("providerId");
  const categoryId = searchParams.get("categoryId");

  const provider = users.find((u) => u.id === providerId);
  const category = categories.find((c) => c.id === categoryId);

  const [form, setForm] = useState({ address: "", city: "", date: "", time: "", notes: "", selectedCategoryId: categoryId || "" });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1=details, 2=confirm
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.city) setForm((p) => ({ ...p, city: p.city || currentUser.city }));
  }, [currentUser?.city]);

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <div className="w-8 h-8 border-4 border-[#19e65e] border-t-transparent rounded-full animate-spin mr-3" />
        Loading…
      </div>
    );
  }

  if (!currentUser || currentUser.role !== ROLES.CUSTOMER) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Button onClick={() => router.push("/auth/login")}>Sign In to Book</Button>
      </div>
    );
  }

  if (!provider || !provider.profile?.isApproved) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600">Provider not found or unavailable.</p>
        <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const selectedCat = categories.find((c) => c.id === form.selectedCategoryId) || category;
  const estimatedPrice = selectedCat ? selectedCat.basePrice : 0;

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })); }

  function validate() {
    const e = {};
    if (!form.selectedCategoryId) e.selectedCategoryId = "Please select a service";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    const today = new Date().toISOString().split("T")[0];
    if (form.date < today) e.date = "Date cannot be in the past";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() { if (validate()) setStep(2); }

  function handleConfirm() {
    setLoading(true);
    createBooking({
      customerId: currentUser.id,
      providerId: provider.id,
      categoryId: form.selectedCategoryId,
      address: form.address,
      city: form.city,
      date: form.date,
      time: form.time,
      notes: form.notes,
      price: estimatedPrice,
      images: [],
    });
    setLoading(false);
    router.push("/customer/bookings?booked=true");
  }

  const providerCats = categories.filter((c) => provider.profile.categoryIds.includes(c.id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Book a Service</h1>
      <p className="text-gray-500 text-sm mb-8">with <span className="font-medium text-gray-700">{provider.name}</span></p>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {["Service Details", "Confirm & Book"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-[#19e65e] text-white" : "bg-gray-200 text-gray-500"}`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === i + 1 ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
            {i === 0 && <div className="w-8 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <Select
            label="Service Type"
            value={form.selectedCategoryId}
            onChange={(e) => set("selectedCategoryId", e.target.value)}
            error={errors.selectedCategoryId}
          >
            <option value="">Select a service</option>
            {providerCats.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name} – from ₹{c.basePrice}</option>
            ))}
          </Select>

          <Input
            label="Service Address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Full address where service is needed"
            error={errors.address}
          />
          <Input
            label="City"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="City"
            error={errors.city}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              error={errors.date}
              min={new Date().toISOString().split("T")[0]}
            />
            <Input
              label="Time"
              type="time"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
              error={errors.time}
            />
          </div>
          <Textarea
            label="Notes (optional)"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Describe the problem or any special instructions..."
            rows={3}
          />
          <Button onClick={handleNext} className="w-full" size="lg">
            Continue to Review
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Booking Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-2xl">{selectedCat?.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{selectedCat?.name}</p>
                  <p className="text-gray-500">with {provider.name}</p>
                </div>
              </div>
              <hr className="border-gray-100" />
              {[
                { icon: <Calendar className="w-4 h-4" />, label: "Date & Time", value: `${form.date} at ${form.time}` },
                { icon: <MapPin className="w-4 h-4" />, label: "Address", value: `${form.address}, ${form.city}` },
                { icon: <FileText className="w-4 h-4" />, label: "Notes", value: form.notes || "—" },
              ].map((r) => (
                <div key={r.label} className="flex items-start gap-3 text-sm">
                  <span className="text-gray-400 mt-0.5">{r.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400">{r.label}</p>
                    <p className="text-gray-700">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#e8fdf0] rounded-2xl border border-[#19e65e]/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Estimated Price</p>
                <p className="text-xs text-[#14a84a] mt-0.5">Final price confirmed by provider</p>
              </div>
              <div className="flex items-center gap-1 text-2xl font-bold text-[#14a84a]">
                <IndianRupee className="w-5 h-5" />
                {estimatedPrice?.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
              Edit Details
            </Button>
            <Button onClick={handleConfirm} disabled={loading} className="flex-1" size="lg">
              {loading ? "Confirming..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-500">Loading...</div>}>
      <BookPage />
    </Suspense>
  );
}
