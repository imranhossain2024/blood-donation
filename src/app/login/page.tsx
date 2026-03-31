import LoginForm from "@/components/forms/LoginForm";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const dict = await getDictionary(locale);
  const registered = searchParams.registered === "1";

  return (
    <section className="container-pad flex min-h-[70vh] flex-col items-center justify-center gap-4 py-16">
      {registered ? (
        <div className="rounded-2xl border border-brand-100 bg-white/80 px-6 py-3 text-sm text-ink/70">
          Registration ??? ?????! ??? ???? ?????
        </div>
      ) : null}
      <LoginForm dict={dict} />
    </section>
  );
}

