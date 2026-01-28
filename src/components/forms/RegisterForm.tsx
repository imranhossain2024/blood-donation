"use client";

import { useFormState } from "react-dom";
import { registerUser } from "@/app/actions/auth";

const initialState = { ok: true } as { ok: boolean; error?: Record<string, string[]> };

export default function RegisterForm() {
  const [state, formAction] = useFormState(registerUser, initialState);

  return (
    <div className="card max-w-lg">
      <h1 className="text-3xl font-semibold">Create your account</h1>
      <p className="mt-2 text-sm text-ink/70">
        Register to request blood, track status, and become a verified donor.
      </p>
      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Full name
          </label>
          <input
            name="name"
            type="text"
            required
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          />
          {state?.error?.name ? (
            <p className="mt-2 text-xs text-brand-700">{state.error.name[0]}</p>
          ) : null}
        </div>
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
          {state?.error?.email ? (
            <p className="mt-2 text-xs text-brand-700">{state.error.email[0]}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-ink/60">
            Password
          </label>
          <input
            name="password"
            type="password"
            minLength={6}
            required
            className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm"
          />
          {state?.error?.password ? (
            <p className="mt-2 text-xs text-brand-700">{state.error.password[0]}</p>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
      </form>
    </div>
  );
}
