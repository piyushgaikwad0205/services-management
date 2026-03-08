"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/data";
import Button from "@/components/Button";
import Input, { Textarea, Select } from "@/components/Input";
import { CheckCircle2, User, MapPin } from "lucide-react";

export default function ProviderProfilePage() {
  const router = useRouter();
  const { currentUser, categories, updateProviderProfile, dbLoading } = useApp();

  const [form, setForm] = useState({ name: "", city: "", bio: "", experience: 0, categoryIds: [], areas: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || "",
        city: currentUser.city || "",
        bio: currentUser.profile?.bio || "",
        experience: currentUser.profile?.experience || 0,
        categoryIds: currentUser.profile?.categoryIds || [],
        areas: currentUser.profile?.areas?.join(", ") || "",
      });
    }
  }, [currentUser?.id]);

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

  function toggleCategory(catId) {
    setForm((p) => ({
      ...p,
      categoryIds: p.categoryIds.includes(catId)
        ? p.categoryIds.filter((c) => c !== catId)
        : [...p.categoryIds, catId],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateProviderProfile(
      currentUser.id,
      { name: form.name, city: form.city },
      {
        bio: form.bio,
        experience: Number(form.experience),
        categoryIds: form.categoryIds,
        areas: form.areas.split(",").map((a) => a.trim()).filter(Boolean),
      }
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Update your professional information</p>
      </div>

      {/* Profile Card Preview */}
      <div className="bg-[#19e65e] rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
            {currentUser.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin className="w-4 h-4" /> {currentUser.city}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${currentUser.profile.isApproved ? "bg-green-400/30 text-green-100" : "bg-yellow-400/30 text-yellow-100"}`}>
                {currentUser.profile.isApproved ? "✓ Approved" : "⏳ Pending Approval"}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${currentUser.profile.isAvailable ? "bg-green-400/30 text-green-100" : "bg-gray-400/30 text-gray-100"}`}>
                {currentUser.profile.isAvailable ? "🟢 Available" : "🔴 Unavailable"}
              </span>
            </div>
          </div>
        </div>
        {currentUser.profile.rating > 0 && (
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="text-yellow-300 font-bold">★ {currentUser.profile.rating}</span>
            <span className="text-white/80">({currentUser.profile.reviewCount} reviews)</span>
            <span className="text-white/80">• {currentUser.profile.experience} years exp</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#14a84a]" /> Basic Information
          </h3>
          <div className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            <Input label="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="e.g. Mumbai" required />
            <Textarea
              label="Bio / About You"
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Describe your expertise, experience, and what makes you stand out..."
              rows={3}
            />
            <Input
              label="Years of Experience"
              type="number"
              min={0}
              max={50}
              value={form.experience}
              onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
            />
            <Input
              label="Service Areas (comma-separated)"
              value={form.areas}
              onChange={(e) => setForm((p) => ({ ...p, areas: e.target.value }))}
              placeholder="e.g. Andheri, Bandra, Juhu"
            />
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Services You Offer</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const selected = form.categoryIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition ${
                    selected ? "border-[#19e65e] bg-[#e8fdf0] text-[#14a84a]" : "border-gray-200 hover:border-[#19e65e]/50 text-gray-700"
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <p className="text-xs font-semibold">{cat.name}</p>
                    {selected && <p className="text-xs text-[#14a84a]">✓ Selected</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full">
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Profile Saved!</> : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
