"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/data";
import { useState } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const navLinks = currentUser
    ? currentUser.role === ROLES.CUSTOMER
      ? [
          { href: "/", label: "Browse" },
          { href: "/customer/bookings", label: "My Bookings" },
        ]
      : currentUser.role === ROLES.PROVIDER
      ? [
          { href: "/provider/dashboard", label: "Dashboard" },
          { href: "/provider/jobs", label: "Jobs" },
          { href: "/provider/profile", label: "Profile" },
        ]
      : [
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/providers", label: "Providers" },
          { href: "/admin/categories", label: "Categories" },
          { href: "/admin/reviews", label: "Reviews" },
        ]
    : [];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#19e65e] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">ServBook</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-[#19e65e] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-[#e8fdf0] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#19e65e]" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-none">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                  </div>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    {navLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" />
                        {l.label}
                      </Link>
                    ))}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { logout(); setDropOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#19e65e] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-[#19e65e] text-white text-sm font-semibold rounded-xl hover:bg-[#14c750] transition shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700 hover:text-[#14a84a]"
            >
              {l.label}
            </Link>
          ))}
          {currentUser && (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="block py-2 text-sm font-medium text-red-600"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
