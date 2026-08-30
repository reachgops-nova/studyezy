"use client";

import { useEffect, useRef, useState } from "react";

// Page-by-page reader for a unit's uploaded textbook pages - replaces the
// earlier flat photo grid (2026-08-21: "display as a booklet"). Pages arrive
// already in book order (lib/content.ts's getUnitBookletImages orders by
// upload time, which matches page order since pages are uploaded in
// sequence), so this just needs to turn one page at a time instead of
// dumping all of them into a grid.
export default function Booklet({
  images,
  alt,
  className,
  syncToIndex,
}: {
  images: string[];
  alt: (index: number) => string;
  className?: string;
  /**
   * Page to jump to when the surrounding lesson moves to a new concept
   * (UnitView passes the index of the concept's own reference page). Only
   * applied when the VALUE CHANGES, never on every render - so a kid who
   * has manually flipped back a few pages to hunt for a clue keeps their
   * place until the lesson genuinely moves on to a different concept.
   */
  syncToIndex?: number;
}) {
  const [index, setIndex] = useState(syncToIndex !== undefined && syncToIndex >= 0 ? syncToIndex : 0);
  const [zoomed, setZoomed] = useState(false);
  const lastSynced = useRef(syncToIndex);

  useEffect(() => {
    if (syncToIndex === undefined || syncToIndex < 0) return;
    if (lastSynced.current === syncToIndex) return;
    lastSynced.current = syncToIndex;
    setIndex(syncToIndex);
  }, [syncToIndex]);

  if (images.length === 0) return null;
  const safeIndex = Math.max(0, Math.min(index, images.length - 1));
  const goTo = (i: number) => setIndex(Math.max(0, Math.min(images.length - 1, i)));

  return (
    <div className={className}>
      <div className="relative mx-auto max-w-md">
        <div
          // aspect-[3/4] matches the real proportions of a scanned textbook page.
          // aspect-square letterboxed a portrait page into a square box, which
          // shrank the printed text to the point kids could not read it without
          // opening the zoom modal every single time (2026-08-30).
          className="aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
          onClick={() => setZoomed(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[safeIndex]}
            alt={alt(safeIndex)}
            style={{ imageOrientation: "from-image" }}
            className="h-full w-full object-contain"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(safeIndex - 1)}
              disabled={safeIndex === 0}
              aria-label="Previous page"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 px-2.5 py-1.5 text-lg font-semibold text-slate-700 shadow-soft disabled:opacity-0"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(safeIndex + 1)}
              disabled={safeIndex === images.length - 1}
              aria-label="Next page"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 px-2.5 py-1.5 text-lg font-semibold text-slate-700 shadow-soft disabled:opacity-0"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="mx-auto mt-2 flex max-w-md items-center justify-between text-xs text-slate-500">
        <span>
          Page {safeIndex + 1} of {images.length}
        </span>
        <span>Tap the page to zoom in</span>
      </div>

      {images.length > 1 && (
        <div className="mx-auto mt-3 flex max-w-md gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`shrink-0 overflow-hidden rounded-lg border-2 ${
                i === safeIndex ? "border-brand-ink" : "border-transparent opacity-70"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                style={{ imageOrientation: "from-image" }}
                className="h-14 w-14 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
          >
            ✕ Close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[safeIndex]}
            alt={alt(safeIndex)}
            style={{ imageOrientation: "from-image" }}
            className="max-h-full max-w-full cursor-zoom-out rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(safeIndex - 1);
                }}
                disabled={safeIndex === 0}
                aria-label="Previous page"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-3 text-2xl text-white hover:bg-white/20 disabled:opacity-30"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(safeIndex + 1);
                }}
                disabled={safeIndex === images.length - 1}
                aria-label="Next page"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-3 text-2xl text-white hover:bg-white/20 disabled:opacity-30"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
