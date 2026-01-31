import { makeAdminByEmail } from "@/app/actions/makeadmin";

export default function MakeAdminPage() {
  return (
    <section className="container-pad py-16 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Make Admin Panel</h1>
      <form action={async (_formData: FormData) => {
        "use server";
        await makeAdminByEmail(_formData);
        return;
      }} className="card p-6 flex flex-col gap-4">
        <label className="text-sm font-semibold">User Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="Enter user email"
          className="rounded-xl border px-4 py-2"
        />
        <button type="submit" className="btn btn-primary mt-2">Make Admin</button>
      </form>
      <p className="mt-4 text-xs text-ink/60">For development/demo only. Remove in production.</p>
    </section>
  );
}
