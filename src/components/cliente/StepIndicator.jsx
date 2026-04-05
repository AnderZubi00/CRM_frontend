import { motion as Motion, useReducedMotion } from "framer-motion";

/**
 * Horizontal step indicator for checkout flow.
 * @param {{ steps: string[], currentStep: number }} props
 */
export default function StepIndicator({ steps, currentStep }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex items-center justify-center gap-0 w-full mb-8">
      {steps.map((label, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isFuture = idx > currentStep;

        return (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <Motion.div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors"
                style={{
                  background: isCompleted || isCurrent
                    ? "var(--tienda-accent)"
                    : "transparent",
                  color: isCompleted || isCurrent
                    ? "#fff"
                    : "var(--tienda-text-muted)",
                  border: isFuture
                    ? "2px solid var(--tienda-border)"
                    : "2px solid var(--tienda-accent)",
                }}
                animate={
                  reduceMotion
                    ? {}
                    : { scale: isCurrent ? [1, 1.08, 1] : 1 }
                }
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </Motion.div>
              <span
                className="text-xs font-medium text-center whitespace-nowrap"
                style={{
                  color: isCurrent
                    ? "var(--tienda-accent)"
                    : isCompleted
                    ? "var(--tienda-text)"
                    : "var(--tienda-text-muted)",
                }}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 rounded-full relative overflow-hidden"
                style={{ background: "var(--tienda-border)" }}
              >
                <Motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: "var(--tienda-accent)" }}
                  initial={false}
                  animate={{
                    width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.3, ease: "easeOut" }
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
