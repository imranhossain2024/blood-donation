"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-sand p-6 text-center text-ink">
        <h2 className="text-3xl font-bold text-brand-600 mb-4">Something went wrong!</h2>
        <p className="text-ink/70 mb-8 max-w-md">
          A critical error occurred. We've been notified and are working on it.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:bg-brand-700 transition"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
