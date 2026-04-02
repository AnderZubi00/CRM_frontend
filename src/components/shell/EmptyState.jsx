import { cn } from "@/lib/utils";

export default function EmptyState({ title = "Sin resultados", description, right, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center text-sm",
        className
      )}
    >
      <p className="font-medium text-foreground">{title}</p>
      {description ? <p className="mt-1 text-muted-foreground">{description}</p> : null}
      {right ? <div className="mt-4 flex justify-center">{right}</div> : null}
    </div>
  );
}

