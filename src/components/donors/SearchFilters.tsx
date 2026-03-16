"use client";

import { bloodGroupLabels } from "@/lib/utils";
import { bloodGroups } from "@/lib/validators";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type FiltersProps = {
  initialParams: {
    bloodGroup?: string;
    location?: string;
    availability?: string;
    lastDonation?: string;
    keyword?: string;
  };
};

export default function SearchFilters({ initialParams }: FiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState(initialParams);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Debounce logic could be added here, but for now we rely on form submit
  };

  const hasActiveFilters = Object.values(filters).some(val => val);

  return (
    <div className="card mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Filter donors</h2>
        <p className="mt-1 text-sm text-ink/70">Use filters to find the right donor for your needs.</p>
      </div>

      <form
        className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          const params = new URLSearchParams();
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value as string);
          });
          startTransition(() => {
            router.push(`/donors?${params.toString()}`);
          });
        }}
      >
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">Keyword</label>
          <input
            name="keyword"
            type="text"
            value={filters.keyword || ""}
            onChange={handleChange}
            placeholder="Name, email, or location"
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">Blood group</label>
          <select
            name="bloodGroup"
            value={filters.bloodGroup || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          >
            <option value="">All blood groups</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {bloodGroupLabels[group]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">Location</label>
          <input
            name="location"
            type="text"
            value={filters.location || ""}
            onChange={handleChange}
            placeholder="e.g. Gulshan"
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">Availability</label>
          <select
            name="availability"
            value={filters.availability || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          >
             <option value="">Any status</option>
             <option value="AVAILABLE">Available</option>
             <option value="UNAVAILABLE">Not available</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">Last Donation</label>
          <select
            name="lastDonation"
            value={filters.lastDonation || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          >
            <option value="">Any time</option>
            <option value="30">Within 30 days</option>
            <option value="90">Within 90 days</option>
            <option value="180">Within 180 days</option>
          </select>
        </div>

        <div className="flex items-end gap-2 py-0.5">
          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? "Searching..." : "Search"}
          </button>
          {hasActiveFilters && (
            <Link href="/donors" className="btn btn-outline" onClick={() => setFilters({})}>
              Clear
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
