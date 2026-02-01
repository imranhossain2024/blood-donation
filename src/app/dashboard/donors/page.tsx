"use client";

import DonorsClientView from "@/components/donors/DonorsClientView";
import { Suspense } from "react";

export default function DonorsPage() {
  return (
    <Suspense fallback={<div className="container-pad py-16 animate-pulse">Loading cached donors...</div>}>
      <DonorsClientView />
    </Suspense>
  );
}
