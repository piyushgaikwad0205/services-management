export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}
      <input
        className={`w-full px-3.5 py-2.5 rounded-xl border-[1.5px] text-sm focus:outline-none transition bg-white ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-400"
            : "border-gray-200 focus:border-[#19e65e] focus:shadow-[0_0_0_3px_rgba(25,230,94,0.12)]"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <textarea
        className={`w-full px-3.5 py-2.5 rounded-xl border-[1.5px] text-sm focus:outline-none transition resize-none bg-white ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-400"
            : "border-gray-200 focus:border-[#19e65e] focus:shadow-[0_0_0_3px_rgba(25,230,94,0.12)]"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <select
        className={`w-full px-3.5 py-2.5 rounded-xl border-[1.5px] text-sm focus:outline-none transition bg-white ${
          error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 focus:border-[#19e65e] focus:shadow-[0_0_0_3px_rgba(25,230,94,0.12)]"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
