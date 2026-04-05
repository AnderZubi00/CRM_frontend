/**
 * Semantic breadcrumb navigation.
 * @param {{ items: Array<{ label: string, onClick?: () => void }> }} props
 */
export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Navegación" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <svg
                  className="h-3.5 w-3.5 flex-shrink-0"
                  style={{ color: "var(--tienda-text-muted)" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {isLast || !item.onClick ? (
                <span
                  className={`truncate ${isLast ? "font-semibold" : ""}`}
                  style={{
                    color: isLast
                      ? "var(--tienda-text)"
                      : "var(--tienda-text-muted)",
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="truncate transition-colors hover:underline cursor-pointer"
                  style={{ color: "var(--tienda-text-muted)" }}
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
