import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "ServBook – Local Services Booking Platform",
  description: "Connect with trusted local service professionals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen antialiased">
        <AppProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <footer className="bg-white border-t border-gray-200 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
              © 2026 ServBook — Connecting you with trusted local professionals
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
