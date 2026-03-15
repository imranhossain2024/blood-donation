"use client";

import { registerUser, type RegisterState } from "@/app/actions/auth";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

const initialState: RegisterState = { ok: true };

export default function RegisterForm() {
  const [state, formAction] = useFormState(registerUser, initialState);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state && state.ok && !state.error && state.ok === true && state !== initialState) {
      router.push("/login?registered=1");
    }
  }, [state, router]);

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registration Successful!">
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-lg font-semibold text-brand-700">Your account has been created.</div>
          <div className="text-sm text-ink/70">You can now sign in and start using the platform.</div>
          <button className="btn btn-primary mt-4" onClick={() => { setModalOpen(false); window.location.href = '/login'; }}>
            Go to Login
          </button>
        </div>
      </Modal>
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
            {state?.error && typeof state.error === "object" && "name" in state.error ? (
              <p className="mt-2 text-xs text-brand-700">{(state.error as any).name?.[0]}</p>
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
            {state?.error && typeof state.error === "object" && "email" in state.error ? (
              <p className="mt-2 text-xs text-brand-700">{(state.error as any).email?.[0]}</p>
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
            {state?.error && typeof state.error === "object" && "password" in state.error ? (
              <p className="mt-2 text-xs text-brand-700">{(state.error as any).password?.[0]}</p>
            ) : null}
          </div>
          {state?.error && typeof state.error === "string" ? (
            <p className="mt-2 text-center text-xs text-brand-700 font-bold">{state.error}</p>
          ) : null}
          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </form>
      </div>
    </>
  );
}
