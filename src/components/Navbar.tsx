import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthMenu from "@/components/AuthMenu";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-sand/80 backdrop-blur">
      <div className="container-pad flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
            BD
          </div>
          <div>
            <div className="text-lg font-semibold">BloodBond</div>
            <div className="text-xs uppercase tracking-[0.2em] text-ink/60">
              Donate + Save
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-ink/70 md:flex">
          <Link href="/about" className="transition hover:text-ink">
            About
          </Link>
          <Link href="/donors" className="transition hover:text-ink">
            Donor List
          </Link>
          <Link href="/requests-list" className="transition hover:text-ink">
            Browse Requests
          </Link>
          <Link href="/contact" className="transition hover:text-ink">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <AuthMenu name={session.user.name} role={session.user.role} />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn btn-outline">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
