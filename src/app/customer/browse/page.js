"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/data";
import { Star, MapPin, CheckCircle2, Clock } from "lucide-react";
import Button from "@/components/Button";
import Input, { Select } from "@/components/Input";

function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories, users, currentUser, dbLoading } = useApp();

  const preselectedCat = searchParams.get("categoryId") || "";
  const preCity = searchParams.get("city") || "";

  const [selectedCat, setSelectedCat] = useState(preselectedCat);
  const [city, setCity] = useState(preCity);

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
        <p className="text-gray-600 mb-4">Please sign in as a customer to browse services.</p>
        <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
      </div>
    );
  }

  const approvedProviders = users.filter(
    (u) =>
      u.role === ROLES.PROVIDER &&
      u.profile?.isApproved &&
      (!selectedCat || u.profile.categoryIds.includes(selectedCat)) &&
      (!city || u.city.toLowerCase().includes(city.toLowerCase()) ||
        u.profile.areas?.some((a) => a.toLowerCase().includes(city.toLowerCase())))
  );

  const selectedCategory = categories.find((c) => c.id === selectedCat);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Service Providers</h1>
        <p className="text-gray-500 text-sm mt-1">Browse verified professionals in your area</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select
            label="Service Category"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </Select>
        </div>
        <div className="flex-1">
          <Input
            label="City or Area"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Filter by city or area"
          />
        </div>
      </div>

      {/* Results */}
      {approvedProviders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-semibold text-gray-900 mb-1">No providers found</h3>
          <p className="text-gray-500 text-sm">Try changing the category or city filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedProviders.map((provider) => {
            const providerCategories = categories.filter((c) =>
              provider.profile.categoryIds.includes(c.id)
            );
            return (
              <div
                key={provider.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#19e65e] rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {provider.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                      <span className={`w-2.5 h-2.5 rounded-full ${provider.profile.isAvailable ? "bg-green-500" : "bg-gray-300"}`} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="w-3 h-3" /> {provider.city}
                    </div>
                    {provider.profile.rating > 0 && (
                      <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-medium">{provider.profile.rating}</span>
                        <span className="text-gray-400">({provider.profile.reviewCount} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{provider.profile.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {providerCategories.map((c) => (
                    <span key={c.id} className="text-xs bg-[#e8fdf0] text-[#14a84a] px-2 py-0.5 rounded-full">
                      {c.icon} {c.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {provider.profile.experience}y exp
                  </span>
                  {provider.profile.areas?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      {provider.profile.areas.slice(0, 2).join(", ")}
                    </span>
                  )}
                </div>

                {selectedCategory && (
                  <p className="text-xs text-[#14a84a] font-medium mb-3">
                    Starting from ₹{selectedCategory.basePrice}
                  </p>
                )}

                <Button
                  className="w-full"
                  disabled={!provider.profile.isAvailable}
                  onClick={() =>
                    router.push(
                      `/customer/book?providerId=${provider.id}&categoryId=${selectedCat || provider.profile.categoryIds[0]}`
                    )
                  }
                >
                  {provider.profile.isAvailable ? "Book Now" : "Unavailable"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BrowsePageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-500">Loading...</div>}>
      <BrowsePage />
    </Suspense>
  );
}
