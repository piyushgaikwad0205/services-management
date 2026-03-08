export default function StarRating({ value = 0, max = 5, onChange }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i + 1)}
          className={`text-2xl transition-transform hover:scale-110 ${
            i < value ? "text-yellow-400" : "text-gray-300"
          } ${onChange ? "cursor-pointer" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
