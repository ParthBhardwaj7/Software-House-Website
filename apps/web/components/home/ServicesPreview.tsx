import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DUMMY_SERVICES } from "@/lib/dummy-data";

export function ServicesPreview() {
  return (
    <section className="py-16 md:py-24 bg-[#FFFFFF]">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="font-display text-3xl font-normal tracking-tight text-[#0F172A] md:text-4xl">Services</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#64748B]">
            End-to-end capabilities for digital products, growth, and intelligent systems.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DUMMY_SERVICES.map((s) => (
            <Card
              key={s.id}
              className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="mb-2 h-1 w-12 rounded-full bg-[#22C55E]" />
                <CardTitle className="text-lg text-[#0F172A]">{s.title}</CardTitle>
                <CardDescription className="text-[#64748B]">{s.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
