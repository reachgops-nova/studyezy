"use client";

import { useState } from "react";

// Shared zoom-to-fullsize viewer for uploaded textbook page photos - lets a
// kid or parent enlarge a page to actually read it clearly, since a fixed
// on-page thumbnail is often too small for fine print (2026-08-20: "adjusted
// to the reader"). imageOrientation: "from-image" is an explicit safety net
// for EXIF-rotated phone photos - most modern browsers already default to
// this, but it's cheap to guarantee rather than assume.
export default function ImageLightbox({
  images,
  alt,
  className,
  imgClassName,
}: {
  images: string[];
  alt: (index: number) => string;
  className?: string;
  imgClassName: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className={className}>
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={alt(i)}
            style={{ imageOrientation: "from-image" }}
            className={`${imgClassName} cursor-zoom-in`}
            onClick={() => setOpenIndex(i)}
          />
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
          >
            ✕ Close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[openIndex]}
            alt={alt(openIndex)}
            style={{ imageOrientation: "from-image" }}
            className="max-h-full max-w-full cursor-zoom-out rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenIndex(i);
                  }}
                  aria-label={`Page ${i + 1}`}
                  className={`h-2 w-2 rounded-full ${i === openIndex ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
