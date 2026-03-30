"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Faq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export default function EditFaqPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const token = getAccessToken();
  const [form, setForm] = useState<Faq | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    api
      .get<Faq>(`/admin/faqs/${id}`, token)
      .then(setForm)
      .catch(() => router.push("/admin/faqs"));
  }, [token, id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !form) return;
    await api.put(
      `/admin/faqs/${id}`,
      {
        question: form.question.trim(),
        answer: form.answer.trim(),
        sortOrder: form.sortOrder,
      },
      token
    );
    router.push("/admin/faqs");
    router.refresh();
  }

  if (!form) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div>
      <Link href="/admin/faqs" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Back to FAQs
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-[#0F172A]">Edit FAQ</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => setForm((f) => (f ? { ...f, sortOrder: parseInt(e.target.value, 10) || 0 } : f))}
            className="mt-1 border-[#E5E7EB]"
          />
        </div>
        <div>
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            value={form.question}
            onChange={(e) => setForm((f) => (f ? { ...f, question: e.target.value } : f))}
            className="mt-1 border-[#E5E7EB]"
            required
            maxLength={500}
          />
        </div>
        <div>
          <Label htmlFor="answer">Answer</Label>
          <Textarea
            id="answer"
            rows={6}
            value={form.answer}
            onChange={(e) => setForm((f) => (f ? { ...f, answer: e.target.value } : f))}
            className="mt-1 border-[#E5E7EB]"
            required
            maxLength={20000}
          />
        </div>
        <Button type="submit" className="bg-[#22C55E] hover:bg-[#16A34A]">
          Save FAQ
        </Button>
      </form>
    </div>
  );
}
