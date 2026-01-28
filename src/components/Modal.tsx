import { useState } from "react";

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-ink/60 hover:text-ink"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2 text-center">{title}</h2>
        <div className="text-center">{children}</div>
      </div>
    </div>
  );
}
