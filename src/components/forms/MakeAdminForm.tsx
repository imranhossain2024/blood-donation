"use client";

import { makeAdminByEmail } from "@/app/actions/makeadmin";
import { useState, useTransition } from "react";
import { CheckCircle, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";

export default function MakeAdminForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const resp = await makeAdminByEmail(formData);
      setResult(resp);
      if (resp.ok) {
        setEmail("");
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card shadow-2xl border-brand-100 bg-white/80 backdrop-blur-sm p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-50 rounded-full opacity-50 blur-3xl pointer-events-none" />
        
        <div className="relative">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-4 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-ink">Elevate to Admin</h1>
            <p className="text-sm text-ink/60 mt-2">Provide a user&apos;s email to grant them full administrative privileges.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] font-bold text-ink/50 ml-1">
                User Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-brand-50 bg-brand-50/30 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none text-ink font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={clsx(
                "btn w-full py-4 rounded-2xl font-bold text-lg shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2",
                isPending ? "bg-brand-400 cursor-not-allowed" : "btn-primary"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Grant Admin Access"
              )}
            </button>
          </form>

          {/* Feedback Messages */}
          <div className="mt-6 min-h-[60px]">
            {result && (
              <div
                className={clsx(
                  "p-4 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500",
                  result.ok 
                    ? "bg-green-50 border border-green-100 text-green-800" 
                    : "bg-red-50 border border-red-100 text-red-800"
                )}
              >
                <div className={clsx(
                  "mt-0.5 p-1.5 rounded-full shrink-0",
                  result.ok ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}>
                  {result.ok ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {result.ok ? "Success!" : "Action Failed"}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {result.ok 
                      ? "User role has been successfully updated to ADMIN. They can now access all administrative features." 
                      : result.error || "Something went wrong. Please try again later."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-center text-xs text-ink/40 font-medium tracking-wide">
        STRICTLY FOR INTERNAL USE • SECURITY AUDITED
      </p>
    </div>
  );
}
