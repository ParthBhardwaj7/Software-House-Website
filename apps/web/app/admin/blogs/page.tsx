"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  createdAt: string;
};

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    api.get<BlogPost[]>("/admin/blogs", token).then(setPosts).catch(() => setPosts([]));
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blogs/new">New Post</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded ${post.published ? "bg-green-500/20 text-green-600" : "bg-muted"}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/blogs/${post.id}`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (confirm("Delete this post?")) {
                      await api.delete(`/admin/blogs/${post.id}`, token!);
                      setPosts((p) => p.filter((x) => x.id !== post.id));
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                /{post.slug} · {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
