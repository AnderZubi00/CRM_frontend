/**
 * Reusable quantity +/- selector with accessible touch targets.
 * @param {{ value: number, onChange: (newVal: number) => void, min?: number, max?: number, size?: "md"|"sm" }} props
 */
export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 999,
  size = "md",
}) {
  const isSm = size === "sm";
  const btnClass = isSm
    ? "flex h-8 w-8 items-center justify-center text-sm font-medium transition-colors hover:bg-stone-100 cursor-pointer"
    : "flex h-11 w-11 items-center justify-center text-lg font-medium transition-colors hover:bg-stone-100 cursor-pointer";
  const spanClass = isSm
    ? "flex h-8 w-10 items-center justify-center border-x text-xs font-semibold"
    : "flex h-11 w-12 items-center justify-center border-x text-sm font-semibold";

  return (
    <div
      className={`inline-flex items-center overflow-hidden border ${
        isSm ? "rounded-lg" : "rounded-xl"
      }`}
      style={{ borderColor: "var(--tienda-border)" }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btnClass} disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Reducir cantidad"
      >
        &minus;
      </button>
      <span
        className={spanClass}
        style={{ borderColor: "var(--tienda-border)", color: "var(--tienda-text)" }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btnClass} disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}
