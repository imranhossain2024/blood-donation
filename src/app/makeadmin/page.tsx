import MakeAdminForm from "@/components/forms/MakeAdminForm";
import SectionHeading from "@/components/SectionHeading";

export default function MakeAdminPage() {
  return (
    <section className="container-pad py-20 min-h-screen bg-sand/10">
      <SectionHeading
        eyebrow="System Administration"
        title="Admin Access Control"
        subtitle="Manage administrative permissions for the platform."
      />
      
      <div className="mt-12">
        <MakeAdminForm />
      </div>
    </section>
  );
}
