import { cn } from "@/lib/utils";

export default function PageHeader({ title, description, right, className }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {right ? <div className="flex flex-wrap gap-2 sm:justify-end">{right}</div> : null}
    </div>
  );
}

