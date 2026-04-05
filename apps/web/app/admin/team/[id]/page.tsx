"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function isProbablyUrl(s: string): boolean {
  const t = s.trim();
  return t.startsWith("http://") || t.startsWith("https://");
}

type Member = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
  sortOrder: number;
  linkedinUrl: string | null;
  githubUrl: string | null;
};

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const token = getAccessToken();
  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    photoUrl: "",
    sortOrder: 0,
    linkedinUrl: "",
    githubUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (!token) return;
    api
      .get<Member>(`/admin/team-members/${id}`, token)
      .then((p) =>
        setForm({
          name: p.name,
          role: p.role,
          bio: p.bio || "",
          photoUrl: p.photoUrl || "",
          sortOrder: p.sortOrder,
          linkedinUrl: p.linkedinUrl || "",
          githubUrl: p.githubUrl || "",
        })
      )
      .catch(() => router.push("/anish/team"));
  }, [id, token, router]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.role.trim()) e.role = "Role is required";
    if (form.photoUrl.trim() && !isProbablyUrl(form.photoUrl)) {
      e.photoUrl = "Enter a full URL (https://…)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate() || !token) return;
    await api.put(
      `/admin/team-members/${id}`,
      {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim() || undefined,
        photoUrl: form.photoUrl.trim() || undefined,
        sortOrder: Number.isFinite(form.sortOrder) ? form.sortOrder : 0,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        githubUrl: form.githubUrl.trim() || undefined,
      },
      token
    );
    router.push("/anish/team");
    router.refresh();
  }

  const showPreview = form.photoUrl.trim() && isProbablyUrl(form.photoUrl.trim()) && !previewError;

  return (
    <div>
      <Link
        href="/anish/team"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to Team
      </Link>
      <h1 className="mb-8 text-2xl font-bold">Edit team member</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={cn(errors.name && "border-destructive")}
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className={cn(errors.role && "border-destructive")}
          />
          {errors.role && <p className="mt-1 text-xs text-destructive">{errors.role}</p>}
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Optional"
          />
        </div>
        <div>
          <Label htmlFor="photoUrl">Photo URL</Label>
          <Input
            id="photoUrl"
            type="url"
            value={form.photoUrl}
            onChange={(e) => {
              setPreviewError(false);
              setForm((f) => ({ ...f, photoUrl: e.target.value }));
            }}
            className={cn(errors.photoUrl && "border-destructive")}
          />
          {errors.photoUrl && <p className="mt-1 text-xs text-destructive">{errors.photoUrl}</p>}
          <div className="mt-3">
            <p className="mb-2 text-xs text-muted-foreground">Preview</p>
            <div className="relative h-24 w-24 overflow-hidden rounded-full border bg-muted ring-2 ring-border">
              {showPreview ? (
                <Image
                  src={form.photoUrl.trim()}
                  alt=""
                  fill
                  className="object-cover"
                  onError={() => setPreviewError(true)}
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-1 text-center text-xs text-muted-foreground">
                  {form.photoUrl.trim() ? "Invalid or loading" : "No image"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))}
          />
        </div>
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input
            id="linkedinUrl"
            value={form.linkedinUrl}
            onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={form.githubUrl}
            onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
          />
        </div>
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}
