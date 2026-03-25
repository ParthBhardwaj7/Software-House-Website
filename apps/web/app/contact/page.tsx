import { Metadata } from "next";
import { ContactForm } from "@/components/home/ContactForm";
import { getTeamMembers } from "@/lib/team";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project or book a consultation with HILO — tell us about your goals and we’ll respond quickly.",
};

export default async function ContactPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="page-marketing min-h-[min(100dvh,56rem)] w-full">
      <div className="page-container page-section-y">
        <ContactForm teamMembers={teamMembers} />
      </div>
    </div>
  );
}
