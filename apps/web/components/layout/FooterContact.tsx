"use client";

import { Mail, Phone } from "lucide-react";

type FooterContactProps = {
  variant?: "default" | "strip";
  contactEmail: string;
  phoneNumber: string;
  officeHours: string;
};

export function FooterContact({
  variant = "default",
  contactEmail,
  phoneNumber,
  officeHours,
}: FooterContactProps) {
  const email = contactEmail.trim();
  const phone = phoneNumber.trim();

  if (variant === "strip") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-[#22C55E] hover:text-[#4ADE80] hover:underline"
          >
            <Mail className="h-4 w-4 text-[#94A3B8]" /> {email}
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-[#22C55E] hover:text-[#4ADE80] hover:underline"
          >
            <Phone className="h-4 w-4 text-[#94A3B8]" /> {phone}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      {phone && (
        <div>
          <p className="font-semibold text-white">Call anytime</p>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="text-[#22C55E] transition-colors hover:text-[#4ADE80] hover:underline"
          >
            {phone}
          </a>
        </div>
      )}
      {email && (
        <div>
          <p className="font-semibold text-white">Email address</p>
          <a
            href={`mailto:${email}`}
            className="text-[#22C55E] transition-colors hover:text-[#4ADE80] hover:underline"
          >
            {email}
          </a>
        </div>
      )}
      {officeHours && (
        <div>
          <p className="font-semibold text-white">Office Hours</p>
          <p className="text-[#94A3B8]">{officeHours}</p>
        </div>
      )}
    </div>
  );
}
