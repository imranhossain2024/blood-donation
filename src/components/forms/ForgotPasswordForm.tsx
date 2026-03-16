"use client";

import React, { useState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await requestPasswordReset(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setMessage(result.success);
    }
  };

  return (
    <div className="card max-w-lg">
      <h1 className="text-3xl font-semibold">Forgot Password</h1>
      <p className="mt-2 text-sm text-ink/70">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {message && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700 border border-emerald-100">
          {message}
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            />
          </div>
          
          {error && <p className="text-sm text-brand-700">{error}</p>}
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <a
          href="/login"
          className="text-sm font-medium text-brand-700 hover:text-brand-800 transition-colors"
        >
          Back to login
        </a>
      </div>
    </div>
  );
}
