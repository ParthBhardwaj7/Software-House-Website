import { allowDummyMarketingContent } from "@/lib/allow-dummy-content";
import { DUMMY_FAQS } from "@/lib/dummy-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export type PublicFaq = { id: string; question: string; answer: string; sortOrder: number };

export async function getPublicFaqs(): Promise<PublicFaq[]> {
  try {
    const res = await fetch(`${API_URL}/faqs`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (row): row is PublicFaq =>
          !!row &&
          typeof row === "object" &&
          typeof (row as PublicFaq).id === "string" &&
          typeof (row as PublicFaq).question === "string" &&
          typeof (row as PublicFaq).answer === "string"
      )
      .map((row) => ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        sortOrder: typeof row.sortOrder === "number" ? row.sortOrder : 0,
      }));
  } catch {
    return [];
  }
}

/** FAQs for the public page: API data, or dummy only when allowed (dev/QA). */
export async function getFaqsForPublicPage(): Promise<PublicFaq[]> {
  const fromApi = await getPublicFaqs();
  if (fromApi.length > 0) return fromApi;
  if (allowDummyMarketingContent()) {
    return DUMMY_FAQS.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      sortOrder: 0,
    }));
  }
  return [];
}
