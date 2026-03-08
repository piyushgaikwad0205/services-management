"use client";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/data";
import Button from "@/components/Button";
import { CheckCircle2, XCircle, MapPin, Star, Briefcase } from "lucide-react";

export default function AdminProvidersPage() {
  const router = useRouter();
  const { currentUser, users, categories, approveProvider, rejectProvider, dbLoading } = useApp();

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

  const providers = users.filter((u) => u.role === ROLES.PROVIDER);
  const pending = providers.filter((p) => !p.profile?.isApproved);
  const approved = providers.filter((p) => p.profile?.isApproved);

  function ProviderCard({ provider, showActions }) {
    const providerCats = categories.filter((c) => provider.profile.categoryIds.includes(c.id));
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-[#19e65e] rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
            {provider.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{provider.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                provider.profile.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {provider.profile.isApproved ? "Approved" : "Pending"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin className="w-3 h-3" /> {provider.city}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{provider.profile.bio || "No bio provided"}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {providerCats.map((c) => (
            <span key={c.id} className="text-xs bg-[#e8fdf0] text-[#14a84a] px-2 py-0.5 rounded-full">
              {c.icon} {c.name}
            </span>
          ))}
          {providerCats.length === 0 && <span className="text-xs text-gray-400">No services listed</span>}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {provider.profile.experience}y exp</span>
          {provider.profile.rating > 0 && (
            <span className="flex items-center gap-1 text-yellow-600">
              <Star className="w-3.5 h-3.5 fill-current" /> {provider.profile.rating} ({provider.profile.reviewCount})
            </span>
          )}
          <span>{provider.email}</span>
        </div>

        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="success"
              size="sm"
              className="flex-1"
              onClick={() => approveProvider(provider.id)}
            >
              <CheckCircle2 className="w-4 h-4" /> Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="flex-1"
              onClick={() => { if (confirm(`Reject ${provider.name}?`)) rejectProvider(provider.id); }}
            >
              <XCircle className="w-4 h-4" /> Reject
            </Button>
          </div>
        )}
        {!showActions && (
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => { if (confirm(`Remove ${provider.name}?`)) rejectProvider(provider.id); }}
            >
              Remove Provider
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Providers</h1>
        <p className="text-gray-500 text-sm mt-1">{providers.length} total providers</p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xs font-bold">{pending.length}</span>
            Pending Approvals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((p) => <ProviderCard key={p.id} provider={p} showActions={true} />)}
          </div>
        </section>
      )}

      {/* Approved */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Approved Providers ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">No approved providers yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.map((p) => <ProviderCard key={p.id} provider={p} showActions={false} />)}
          </div>
        )}
      </section>
    </div>
  );
}
