"use client";

import React, { useState } from "react";
import { resetPassword } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/PasswordInput";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const result = await resetPassword({
      password,
      confirmPassword,
      token,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(result.success);
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  if (success) {
    return (
      <div className="card max-w-lg text-center">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-emerald-700">Password Reset</h1>
        <p className="mt-2 text-ink/70">
          {success}
        </p>
        <p className="mt-4 text-sm text-ink/50">Redirecting to login page...</p>
        <a href="/login" className="btn btn-primary mt-6 inline-block w-full">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="card max-w-lg">
      <h1 className="text-3xl font-semibold">Reset Password</h1>
      <p className="mt-2 text-sm text-ink/70">
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
            New Password
          </label>
          <PasswordInput
            name="password"
            required
            placeholder="Min. 6 characters"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Confirm Password
          </label>
          <PasswordInput
            name="confirmPassword"
            required
            placeholder="Repeat your password"
          />
        </div>

        {error && <p className="text-sm text-brand-700">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
