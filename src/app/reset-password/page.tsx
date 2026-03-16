import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import React from "react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Reset Password | Blood Donation",
  description: "Set a new password for your account.",
};

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = searchParams.token as string;

  if (!token) {
    redirect("/login");
  }

  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-12">
      <ResetPasswordForm token={token} />
    </main>
  );
}
