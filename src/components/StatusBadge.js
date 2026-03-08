import { BOOKING_STATUS } from "@/lib/data";

const statusConfig = {
  [BOOKING_STATUS.REQUESTED]: {
    bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400",
  },
  [BOOKING_STATUS.CONFIRMED]: {
    bg: "bg-[#e8fdf0]", text: "text-[#14a84a]", dot: "bg-[#19e65e]",
  },
  [BOOKING_STATUS.IN_PROGRESS]: {
    bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400",
  },
  [BOOKING_STATUS.COMPLETED]: {
    bg: "bg-[#e8fdf0]", text: "text-[#14a84a]", dot: "bg-[#19e65e]",
  },
  [BOOKING_STATUS.CANCELLED]: {
    bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400",
  },
};

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}
