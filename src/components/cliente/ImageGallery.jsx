import { useState, useRef, useCallback } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * Product image display with hover zoom and fullscreen lightbox.
 * Accepts a single image URL (future-proof for array of images).
 *
 * @param {{ src: string|null, alt: string }} props
 */
export default function ImageGallery({ src, alt }) {
  const reduceMotion = useReducedMotion();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("center center");
  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }, []);

  if (!src) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl tienda-glass overflow-hidden"
        style={{ borderRadius: "var(--tienda-radius-lg)", height: "420px" }}
      >
        <div className="text-center">
          <svg
            className="mx-auto w-16 h-16 text-stone-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm" style={{ color: "var(--tienda-text-muted)" }}>
            Sin imagen disponible
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main image with hover zoom */}
      <Motion.div
        ref={imgRef}
        className="overflow-hidden rounded-2xl tienda-glass cursor-zoom-in relative group"
        style={{ borderRadius: "var(--tienda-radius-lg)" }}
        onClick={() => setLightboxOpen(true)}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        initial={reduceMotion ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full object-cover transition-transform duration-300"
          style={{
            maxHeight: "520px",
            transformOrigin: zoomOrigin,
            transform: isZoomed ? "scale(1.6)" : "scale(1)",
          }}
          draggable={false}
        />
        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </Motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setLightboxOpen(false)}
            />
            {/* Image */}
            <Motion.img
              src={src}
              alt={alt}
              className="relative z-10 max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              draggable={false}
            />
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 cursor-pointer"
              aria-label="Cerrar imagen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
