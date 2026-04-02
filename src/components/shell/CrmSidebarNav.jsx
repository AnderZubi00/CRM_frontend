import { cn } from "@/lib/utils";
import { CrmNavIcon } from "./crmNavIcons";

/**
 * @param {{ id: string, label: string, icon: string }[]} items
 */
export default function CrmSidebarNav({ items, section, onSectionChange }) {
  return (
    <nav className="flex flex-col gap-0.5 p-2" aria-label="Secciones">
      {items.map((item) => {
        const active = item.id === section;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange?.(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border-l-[3px] py-2.5 pl-3 pr-2 text-left text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary/10 text-foreground shadow-sm"
                : "border-transparent text-muted-foreground hover:bg-muted/90 hover:text-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            <CrmNavIcon name={item.icon} />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
