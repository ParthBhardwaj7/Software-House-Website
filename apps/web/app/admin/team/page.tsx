"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
  sortOrder: number;
};

export default function AdminTeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    api
      .get<TeamMember[]>("/admin/team-members", token)
      .then(setItems)
      .catch(() => setItems([]));
  }, [token]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team</h1>
        <Button asChild>
          <Link href="/admin/team/new">New team member</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="rounded-2xl shadow-sm">
            <CardContent className="flex flex-row items-start justify-between gap-4 pt-6">
              <div className="min-w-0">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="truncate text-sm text-muted-foreground">{item.role}</p>
                {item.bio && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.bio}</p>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/team/${item.id}`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (confirm("Delete this team member?")) {
                      await api.delete(`/admin/team-members/${item.id}`, token!);
                      setItems((p) => p.filter((x) => x.id !== item.id));
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-muted-foreground">No team members yet. Create one to show on the site.</p>
      )}
    </div>
  );
}
