"use client";

import Modal from "@/components/Modal";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = "/";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    // Show modal after successful login
    setModalOpen(true);
    setTimeout(() => {
      router.refresh();
      router.push(callbackUrl);
    }, 1500);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for modal trigger or registration success on mount
  React.useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setSuccessMessage("Registration successful! You can now log in.");
    }
    
    if (typeof window !== "undefined" && localStorage.getItem("showDonorLoginModal") === "1") {
      setModalOpen(true);
      localStorage.removeItem("showDonorLoginModal");
    }
  }, [searchParams]);

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Login Successful!">
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-lg font-semibold text-brand-700">You have signed in as a donor.</div>
          <div className="text-sm text-ink/70">Welcome! You can now request or donate blood, and manage your profile.</div>
          <button className="btn btn-primary mt-4" onClick={() => setModalOpen(false)}>
            Continue
          </button>
        </div>
      </Modal>
      <div className="card max-w-lg">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-ink/70">
          Login with your email and password or continue with Google.
        </p>

        {successMessage && (
          <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 border border-emerald-100">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
            />
          </div>
          {error ? <p className="text-sm text-brand-700">{error}</p> : null}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-ink/60">
          <span className="h-px flex-1 bg-brand-100" />
          Or
          <span className="h-px flex-1 bg-brand-100" />
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="btn btn-outline w-full"
        >
          Continue with Google
        </button>
      </div>
    </>
  );
}
