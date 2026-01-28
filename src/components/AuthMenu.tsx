"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

type AuthMenuProps = {
  name?: string | null;
  role?: string | null;
};

export default function AuthMenu({ name, role }: AuthMenuProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right text-xs text-ink/70 md:block">
        <div className="font-semibold text-ink">{name ?? "Member"}</div>
        <div className="uppercase tracking-[0.2em]">{role ?? "USER"}</div>
      </div>
      <Link href="/profile" className="btn btn-outline">
        Profile
      </Link>
      <Link href="/dashboard" className="btn btn-outline">
        Dashboard
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="btn btn-primary"
      >
        Sign out
      </button>
    </div>
  );
}
