'use client';

import { useState, useEffect } from 'react';
import { bloodGroupLabels } from '@/lib/utils';
import Link from 'next/link';

interface Donor {
  id: string;
  bloodGroup: string;
  location: string;
  availability: string;
  approved: boolean;
  lastDonationDate?: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export default function DonorsListPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'bloodGroup' | 'location' | 'recent'>('recent');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch('/api/donors');
        const data = await response.json();
        setDonors(data);
      } catch (error) {
        console.error('Failed to fetch donors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const filteredDonors = donors.filter((donor) => {
    if (filterAvailability === 'available') return donor.availability === 'AVAILABLE';
    if (filterAvailability === 'unavailable') return donor.availability === 'UNAVAILABLE';
    return true;
  });

  const sortedDonors = [...filteredDonors].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.user.name || '').localeCompare(b.user.name || '');
      case 'bloodGroup':
        return a.bloodGroup.localeCompare(b.bloodGroup);
      case 'location':
        return a.location.localeCompare(b.location);
      case 'recent':
      default:
        return new Date(b.lastDonationDate || 0).getTime() - new Date(a.lastDonationDate || 0).getTime();
    }
  });

  if (loading) {
    return (
      <section className="container-pad py-16">
        <div className="card text-center py-12">
          <p className="text-ink/70">Loading donors...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-pad py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">All Donors</h1>
        <p className="mt-2 text-sm text-ink/70">
          Browse all {donors.length} registered and approved donors in our network.
        </p>
      </div>

      {/* Filter and Sort */}
      <div className="card mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          >
            <option value="recent">Most recent donors</option>
            <option value="name">Name (A-Z)</option>
            <option value="bloodGroup">Blood group</option>
            <option value="location">Location</option>
          </select>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Availability
          </label>
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value as any)}
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          >
            <option value="all">All donors</option>
            <option value="available">Available only</option>
            <option value="unavailable">Not available only</option>
          </select>
        </div>

        <div className="flex items-end">
          <div className="text-sm text-ink/60">
            Showing <span className="font-semibold text-ink">{sortedDonors.length}</span> of{' '}
            <span className="font-semibold text-ink">{donors.length}</span> donors
          </div>
        </div>
      </div>

      {/* List View */}
      <div className="space-y-3">
        {sortedDonors.length > 0 ? (
          sortedDonors.map((donor) => (
            <div
              key={donor.id}
              className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-600">
                    {bloodGroupLabels[donor.bloodGroup]?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold">{donor.user.name || 'Anonymous Donor'}</h3>
                    <p className="text-xs text-ink/60">{donor.user.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm">
                  <span className="inline-block rounded-full bg-brand-100 px-3 py-1 font-semibold text-brand-700">
                    {bloodGroupLabels[donor.bloodGroup] || donor.bloodGroup}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-ink/70">{donor.location}</span>
                </div>

                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      donor.availability === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {donor.availability === 'AVAILABLE' ? '✓ Available' : 'Not available'}
                  </span>
                </div>

                {donor.lastDonationDate && (
                  <div className="text-xs text-ink/60">
                    Last: {new Date(donor.lastDonationDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card py-12 text-center">
            <div className="text-3xl mb-2">😴</div>
            <h3 className="font-semibold">No donors found</h3>
            <p className="mt-1 text-sm text-ink/70">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/donors" className="btn btn-outline">
          Back to search
        </Link>
        <Link href="/request" className="btn btn-primary">
          Create blood request
        </Link>
      </div>
    </section>
  );
}
