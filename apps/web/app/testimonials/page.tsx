import { Metadata } from "next";
import { TestimonialsPageView } from "@/components/testimonials/TestimonialsPageView";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What people say — community trust and client stories.",
};

export default function TestimonialsPage() {
  return (
    <div className="page-marketing min-w-0 w-full">
      <TestimonialsPageView />
    </div>
  );
}
