import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white/70">
      <div className="container-pad grid gap-6 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <h3 className="text-xl font-semibold">BloodBond</h3>
          <p className="mt-3 text-sm text-ink/70">
            A trusted hub for donors, recipients, and hospitals. Coordinate
            urgent requests, track donations, and save lives faster.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-ink/60">
            Explore
          </div>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-brand-700">
                About
              </Link>
            </li>
            <li>
              <Link href="/donors" className="hover:text-brand-700">
                Donor List
              </Link>
            </li>
            <li>
              <Link href="/request" className="hover:text-brand-700">
                Request Blood
              </Link>
            </li>
            <li>
              <Link href="/requests-list" className="hover:text-brand-700">
                Recent Requests
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-ink/60">
            Contact
          </div>
          <ul className="space-y-2 text-ink/70">
            <li>support@bloodbond.org</li>
            <li>24/7 Hotline: +880 1700 000000</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-100 py-4 text-center text-xs text-ink/60">
        © 2026 BloodBond. Built for rapid response and community care.
      </div>
    </footer>
  );
}