export default function Button({ children, variant = "primary", size = "md", className = "", disabled, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#19e65e] text-white hover:bg-[#14c750] focus:ring-[#19e65e] shadow-sm",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400",
    outline: "border-2 border-[#19e65e] text-[#19e65e] hover:bg-[#e8fdf0] focus:ring-[#19e65e]",
    dark: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
