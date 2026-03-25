import { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { allowDummyMarketingContent } from "@/lib/allow-dummy-content";
import { DUMMY_BLOG_POSTS } from "@/lib/dummy-data";
import { fillToMin } from "@/lib/fill-dummy";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering notes from HILO — AI, backends, product delivery, and how we build software that scales.",
  alternates: { canonical: "/blog" },
};

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  createdAt: string;
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await api.get<BlogPost[]>("/blogs");
  } catch {
    posts = [];
  }
  const minCards = allowDummyMarketingContent() ? 6 : 0;
  posts = fillToMin(posts, DUMMY_BLOG_POSTS as BlogPost[], minCards);

  return (
    <div className="page-marketing page-section-y w-full">
      <div className="page-container">
        <div className="mb-10 text-center md:mb-12">
          <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Insights on AI, backend, and software development.
          </p>
        </div>
        {posts.length === 0 ? (
          <p className="mx-auto max-w-lg text-center text-muted-foreground">
            {allowDummyMarketingContent() ? (
              <>
                No posts yet. Add articles from the admin, or enable sample content with{" "}
                <code className="rounded bg-muted px-1 text-sm">NEXT_PUBLIC_USE_DUMMY_SITEMAP=true</code>.
              </>
            ) : (
              "No articles published yet. Please check back soon."
            )}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.excerpt || post.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
