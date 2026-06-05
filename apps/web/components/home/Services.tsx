"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { DUMMY_SERVICES } from "@/lib/dummy-data";
import { resolveMarketingList } from "@/lib/resolve-marketing-list";

type Service = {
  id: string;
  title: string;
  description: string;
  problem: string | null;
  solution: string | null;
  outcome: string | null;
};

type ServicesProps = { showHeading?: boolean };
export function Services({ showHeading = true }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api
      .get<Service[]>("/services")
      .then(setServices)
      .catch(() => setServices([]));
  }, []);

  const display = useMemo(
    () => resolveMarketingList(services, DUMMY_SERVICES as Service[], 6),
    [services]
  );

  return (
    <section className="py-24 bg-[#f8fafc]">
      <div className="container">
        {showHeading && (
        <div className="text-center mb-16">
          <h2 className="mb-4 font-display text-3xl font-normal tracking-tight text-[#0f172a]">Our Services</h2>
          <p className="text-[#64748b] max-w-2xl mx-auto text-lg">
            We help businesses achieve their goals through strategic software solutions.
          </p>
        </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {display.map((service) => (
            <Card key={service.id} className="rounded-2xl shadow-md bg-white border border-slate-200/60 overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex justify-center pt-6">
                <div className="h-12 w-12 rounded-lg border-2 border-primary flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">{service.title.charAt(0)}</span>
                </div>
              </div>
              <CardHeader className="text-center pt-4">
                <span className="text-xs font-medium text-primary">SERVICE</span>
                <CardTitle className="text-[#111827]">{service.title}</CardTitle>
                <CardDescription className="text-[#6B7280]">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-center">
                {service.problem && <p><span className="font-medium text-[#6B7280]">Problem:</span> {service.problem}</p>}
                {service.solution && <p><span className="font-medium text-[#6B7280]">Solution:</span> {service.solution}</p>}
                {service.outcome && <p><span className="font-medium text-primary">Outcome:</span> {service.outcome}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
