import type { ReactNode } from "react";
import { DashboardProvider } from "@/context/DashboardContext";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="bg-sand">{children}</div>
    </DashboardProvider>
  );
}
