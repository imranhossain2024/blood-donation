import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";

export default async function Footer() {
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const dict = await getDictionary(locale);

  return (
    <footer className="border-t border-brand-100 bg-white/70">
      <div className="container-pad grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr] md:gap-6">
        <div>
          <h3 className="text-xl font-semibold">BloodBond</h3>
          <p className="mt-3 text-sm text-ink/70">
            {dict.footer.tagline}
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-ink/60">
            {dict.footer.explore}
          </div>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-brand-700">
                {dict.footer.about}
              </Link>
            </li>
            <li>
              <Link href="/donors" className="hover:text-brand-700">
                {dict.footer.donorList}
              </Link>
            </li>
            <li>
              <Link href="/request" className="hover:text-brand-700">
                {dict.footer.request}
              </Link>
            </li>
            <li>
              <Link href="/requests-list" className="hover:text-brand-700">
                {dict.footer.recent}
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-ink/60">
            {dict.footer.contact}
          </div>
          <ul className="space-y-2 text-ink/70">
            <li>support@bloodbond.org</li>
            <li>24/7 Hotline: +880 1700 000000</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-100 py-4 text-center text-xs text-ink/60">
        {dict.footer.copyright}
      </div>
    </footer>
  );
}