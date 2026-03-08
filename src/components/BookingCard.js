import StatusBadge from "./StatusBadge";
import { Calendar, MapPin, Clock, IndianRupee } from "lucide-react";

export default function BookingCard({ booking, category, provider, customer, actions }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e8fdf0] rounded-xl flex items-center justify-center text-xl">
            {category?.icon ?? "🔧"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{category?.name ?? "Service"}</h3>
            {provider && <p className="text-xs text-gray-500">by {provider.name}</p>}
            {customer && <p className="text-xs text-gray-500">from {customer.name}</p>}
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          {booking.date}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          {booking.time}
        </div>
        <div className="flex items-center gap-1 col-span-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{booking.address}</span>
        </div>
        <div className="flex items-center gap-1">
          <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
          ₹{booking.price?.toLocaleString()}
        </div>
      </div>

      {booking.notes && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 mb-3 line-clamp-2">
          {booking.notes}
        </p>
      )}

      {actions && <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">{actions}</div>}
    </div>
  );
}
