"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileMenu({
  isLoggedIn,
  sessionName,
}: {
  isLoggedIn: boolean;
  sessionName?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-ink"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[76px] z-50 flex w-full flex-col gap-4 border-b border-brand-100 bg-sand px-6 py-6 shadow-glow">
          <nav className="flex flex-col gap-5 text-base font-semibold text-ink/90">
            <Link href="/about" className="hover:text-brand-700">About</Link>
            <Link href="/donors" className="hover:text-brand-700">Donor List</Link>
            <Link href="/requests-list" className="hover:text-brand-700">Browse Requests</Link>
            <Link href="/contact" className="hover:text-brand-700">Contact</Link>
          </nav>
          
          <div className="mt-4 border-t border-brand-100 pt-6">
            {isLoggedIn ? (
              <div className="flex flex-col gap-4">
                <div className="text-sm font-semibold text-ink/70">Signed in as {sessionName}</div>
                <Link href="/dashboard" className="btn btn-outline text-center justify-center">
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" className="btn btn-outline text-center justify-center">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary text-center justify-center">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
