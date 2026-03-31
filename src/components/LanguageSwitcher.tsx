"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = currentLocale === "bn" ? "en" : "bn";
    
    // Set cookie
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="rounded-full border border-brand-200 bg-sand px-3 py-1 text-sm font-semibold transition hover:bg-brand-100 disabled:opacity-50"
      aria-label="Toggle language"
    >
      {currentLocale === "bn" ? "EN" : "BN"}
    </button>
  );
}
