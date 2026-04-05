/**
 * Shared animation presets for the tienda client panel.
 * All durations 150-250ms, ease-out, performant (opacity + transform only).
 * Pass reduceMotion=true to get empty objects (no animation).
 */

export const fadeIn = (reduceMotion) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2, ease: "easeOut" },
      };

export const fadeUp = (reduceMotion, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.22, ease: "easeOut", delay },
      };

export const fadeLeft = (reduceMotion, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: -24 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3, ease: "easeOut", delay },
      };

export const fadeRight = (reduceMotion, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3, ease: "easeOut", delay },
      };

export const scaleIn = (reduceMotion, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", damping: 14, stiffness: 200, delay },
      };

export const pageTransition = (reduceMotion) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.2, ease: "easeOut" },
      };

export const springPopup = (reduceMotion, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", damping: 12, stiffness: 200, delay },
      };

/** Variants for staggered children (use on parent container) */
export const staggerContainer = (reduceMotion, staggerDelay = 0.04) =>
  reduceMotion
    ? {}
    : {
        initial: "hidden",
        animate: "visible",
        variants: {
          hidden: {},
          visible: { transition: { staggerChildren: staggerDelay } },
        },
      };

/** Variant for each child inside a stagger container */
export const staggerChild = (reduceMotion) =>
  reduceMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.22, ease: "easeOut" },
          },
        },
      };
