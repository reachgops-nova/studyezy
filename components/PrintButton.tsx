"use client";

export default function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden fixed right-6 top-6 rounded-full bg-brand-ink px-5 py-2.5 text-sm font-medium text-white shadow-soft-lg"
    >
      {label}
    </button>
  );
}
