"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/data";
import { Search, MapPin, ChevronRight, Star, CheckCircle, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { categories, users, currentUser } = useApp();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const approvedProviders = users.filter(
    (u) => u.role === ROLES.PROVIDER && u.profile?.isApproved
  );

  function handleCategoryClick(catId) {
    if (!currentUser) { router.push("/auth/login"); return; }
    const params = new URLSearchParams({ categoryId: catId });
    if (city) params.set("city", city);
    router.push(`/customer/browse?${params.toString()}`);
  }

  return (
    <div className="bg-[#f4f6f8]">
      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <span className="inline-flex items-center gap-2 bg-[#e8fdf0] text-[#14a84a] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <CheckCircle className="w-3.5 h-3.5" /> Trusted by 10,000+ customers across India
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
            Book Local Services<br />
            <span className="text-[#19e65e]">at Your Doorstep</span>
          </h1>
          <p className="text-gray-500 text-xl mb-10 max-w-xl mx-auto">
            Connect with verified professionals for plumbing, electrical, cleaning &amp; 50+ services.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none bg-gray-50 focus:bg-white transition" placeholder="Search services…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="relative sm:w-44">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none bg-gray-50 focus:bg-white transition" placeholder="City or area" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <button onClick={() => currentUser ? router.push(`/customer/browse?city=${city}&q=${search}`) : router.push("/auth/login")} className="bg-[#19e65e] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#14c750] transition whitespace-nowrap shadow-sm">
              Search
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-12 mt-14">
            {[{ value: `${approvedProviders.length}+`, label: "Verified Providers" }, { value: `${categories.length}+`, label: "Service Categories" }, { value: "4.8★", label: "Average Rating" }].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Browse Services</h2>
            <p className="text-gray-500 text-sm mt-1">Choose from our wide range of home services</p>
          </div>
          {currentUser?.role === ROLES.CUSTOMER && (
            <Link href="/customer/bookings" className="text-sm text-[#14a84a] font-semibold hover:underline flex items-center gap-1">
              My Bookings <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No services match your search</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCategories.map((cat) => {
              const provCount = approvedProviders.filter((p) =>
                p.profile.categoryIds.includes(cat.id) && (!city || p.city.toLowerCase().includes(city.toLowerCase()))
              ).length;
              return (
                <button key={cat.id} onClick={() => handleCategoryClick(cat.id)} className="group bg-white rounded-2xl border border-gray-200 p-5 text-left hover:border-[#19e65e] hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-[#e8fdf0] rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#14a84a] transition-colors">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-bold text-[#14a84a]">from ₹{cat.basePrice}</span>
                    <span className="text-xs text-gray-400">{provCount} providers</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── How it works ── */}
      <section className="bg-white border-t border-b border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How ServBook Works</h2>
          <p className="text-gray-500 mb-12">Book a service in 3 easy steps</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose a Service", desc: "Browse categories and pick what you need", icon: "🔍" },
              { step: "02", title: "Book & Confirm", desc: "Select provider, pick time, add your details", icon: "📅" },
              { step: "03", title: "Job Done!", desc: "Professional arrives, completes work, you rate", icon: "✅" },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center relative">
                {i < 2 && <div className="hidden sm:block absolute top-8 right-0 translate-x-1/2 text-gray-300"><ArrowRight className="w-6 h-6" /></div>}
                <div className="w-16 h-16 bg-[#e8fdf0] rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">{s.icon}</div>
                <span className="text-xs font-bold text-[#19e65e] mb-1">{s.step}</span>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Providers ── */}
      {approvedProviders.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Top Rated Providers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedProviders.slice(0, 6).map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 bg-[#19e65e] rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">{p.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                    {p.profile.isAvailable && <span className="text-xs bg-[#e8fdf0] text-[#14a84a] font-semibold px-2 py-0.5 rounded-full">Available</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{p.city}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{p.profile.bio}</p>
                  {p.profile.rating > 0 && (
                    <span className="text-xs flex items-center gap-1 text-amber-600 font-semibold mt-2">
                      <Star className="w-3 h-3 fill-current" /> {p.profile.rating} ({p.profile.reviewCount})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {!currentUser && (
        <section className="bg-[#19e65e] py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-3">Ready to Get Started?</h2>
            <p className="text-white/80 mb-8">Join thousands of happy customers and trusted professionals</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register" className="px-8 py-3 bg-white text-[#14a84a] font-bold rounded-xl hover:bg-gray-50 transition shadow-md">Book a Service</Link>
              <Link href="/auth/register" className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition">Become a Provider</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
