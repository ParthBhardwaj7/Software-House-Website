"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewFaqPage() {
  const router = useRouter();
  const token = getAccessToken();
  const [form, setForm] = useState({ question: "", answer: "", sortOrder: 0 });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await api.post(
      "/admin/faqs",
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

  return (
    <div>
      <Link href="/admin/faqs" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Back to FAQs
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-[#0F172A]">New FAQ</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <Label htmlFor="sortOrder">Sort order (lower = first)</Label>
          <Input
            id="sortOrder"
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))}
            className="mt-1 border-[#E5E7EB]"
          />
        </div>
        <div>
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
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
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            className="mt-1 border-[#E5E7EB]"
            required
            maxLength={20000}
          />
        </div>
        <Button type="submit" className="bg-[#22C55E] hover:bg-[#16A34A]">
          Create FAQ
        </Button>
      </form>
    </div>
  );
}
