"use client";

import { reportTarget } from "@/app/actions/report";
import { bloodGroupLabels } from "@/lib/utils";
import { AvailabilityStatus, BloodGroup } from "@prisma/client";
import { useState } from "react";
import Modal from "./Modal";

type DonorCardProps = {
  donor: {
    id: string;
    bloodGroup: BloodGroup;
    location: string;
    phone?: string | null;
    availability: AvailabilityStatus;
    lastDonationDate?: Date | null;
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
  };
};

export default function DonorCard({ donor }: DonorCardProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isReported, setIsReported] = useState(false);

  async function handleReport(formData: FormData) {
    const result = await reportTarget(formData);
    if (result.ok) {
      setIsReported(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setIsReported(false);
      }, 2000);
    }
  }

  return (
    <div className="card group relative">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
            {donor.location}
          </div>
          <h3 className="mt-2 text-xl font-semibold">
            {donor.user.name ?? "Anonymous Donor"}
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-semibold text-white">
          {bloodGroupLabels[donor.bloodGroup] ?? donor.bloodGroup}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className={`pill ${donor.availability === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          {donor.availability === "AVAILABLE" ? "Available" : "Not available"}
        </span>
        {donor.lastDonationDate && (
          <span className="text-[10px] text-ink/40 uppercase tracking-wider">
            Last: {new Date(donor.lastDonationDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        {donor.phone ? (
          <>
            <a
              href={`tel:${donor.phone}`}
              className="btn btn-outline flex-1 py-2 text-xs"
            >
              Call
            </a>
            <a
              href={`https://wa.me/${donor.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex-1 py-2 text-xs"
            >
              WhatsApp
            </a>
          </>
        ) : (
          <div className="flex-1 text-center py-2 text-xs text-ink/40 italic">
            Phone not provided
          </div>
        )}
      </div>

      <button
        onClick={() => setReportModalOpen(true)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink/20 hover:text-brand-700"
        title="Report this donor"
      >
        🚩
      </button>

      <Modal open={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Report Donor">
        {isReported ? (
          <div className="py-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="font-semibold text-brand-700">Thank you for reporting.</p>
            <p className="text-sm text-ink/60 mt-2">Our admins will review this donor shortly.</p>
          </div>
        ) : (
          <form action={handleReport} className="space-y-4 py-2">
            <input type="hidden" name="type" value="DONOR" />
            <input type="hidden" name="targetId" value={donor.user.id} />
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-ink/60">Reason for reporting</label>
              <select name="reason" required className="mt-1 w-full rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm">
                <option value="Fake Donor">Fake Donor / Suspicious Info</option>
                <option value="Incorrect Phone">Incorrect Phone Number</option>
                <option value="Inappropriate Behavior">Inappropriate Behavior</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-ink/60">Your Contact (Optional)</label>
              <input name="reporterPhone" type="text" placeholder="Phone for follow-up" className="mt-1 w-full rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="btn btn-primary w-full">Submit Report</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
