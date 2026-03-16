import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import React from "react";

export const metadata = {
  title: "Forgot Password | Blood Donation",
  description: "Reset your password to access your blood donation account.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-12">
      <ForgotPasswordForm />
    </main>
  );
}
