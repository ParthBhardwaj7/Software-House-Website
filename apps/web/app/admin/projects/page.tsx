"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  createdAt: string;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    api.get<Project[]>("/admin/projects", token).then(setProjects).catch(() => setProjects([]));
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Portfolio</h1>
        <Button asChild>
          <Link href="/admin/projects/new">New Project</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded bg-muted">{project.category}</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (confirm("Delete this project?")) {
                      await api.delete(`/admin/projects/${project.id}`, token!);
                      setProjects((p) => p.filter((x) => x.id !== project.id));
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                /{project.slug} · {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
