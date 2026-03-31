import RegisterForm from "@/components/forms/RegisterForm";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionary";

export default async function RegisterPage() {
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const dict = await getDictionary(locale);

  return (
    <section className="container-pad flex min-h-[70vh] items-center justify-center py-16">
      <RegisterForm dict={dict} />
    </section>
  );
}
