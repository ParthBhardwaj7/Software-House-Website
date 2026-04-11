import { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { allowDummyMarketingContent } from "@/lib/allow-dummy-content";
import { DUMMY_BLOG_POSTS } from "@/lib/dummy-data";
import { defaultOgImages } from "@/lib/default-og";
import { getSiteUrlString } from "@/lib/site-url";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  createdAt: string;
};

function getDummyBySlug(slug: string): BlogPost | undefined {
  const d = DUMMY_BLOG_POSTS.find((p) => p.slug === slug);
  if (!d) return undefined;
  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    content: d.content,
    excerpt: d.excerpt,
    createdAt: d.createdAt,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const base = getSiteUrlString();
  const pathSlug = encodeURIComponent(slug);
  const postUrl = `${base}/blog/${pathSlug}`;
  const images = defaultOgImages();
  try {
    const post = await api.get<BlogPost>(`/blogs/${slug}`);
    const description = post.excerpt || post.title;
    return {
      title: post.title,
      description,
      alternates: { canonical: postUrl },
      openGraph: {
        type: "article",
        title: post.title,
        description,
        url: postUrl,
        publishedTime: post.createdAt,
        images,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images,
      },
    };
  } catch {
    const d = allowDummyMarketingContent() ? getDummyBySlug(slug) : undefined;
    if (d) {
      const description = d.excerpt || d.title;
      return {
        title: d.title,
        description,
        alternates: { canonical: postUrl },
        openGraph: {
          type: "article",
          title: d.title,
          description,
          url: postUrl,
          publishedTime: d.createdAt,
          images,
        },
        twitter: { card: "summary_large_image", title: d.title, description, images },
      };
    }
    return {
      title: "Post not found",
      robots: { index: false, follow: false },
    };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: BlogPost;
  try {
    post = await api.get<BlogPost>(`/blogs/${slug}`);
  } catch {
    const d = allowDummyMarketingContent() ? getDummyBySlug(slug) : undefined;
    if (!d) notFound();
    post = d;
  }

  const pageUrl = `${getSiteUrlString()}/blog/${encodeURIComponent(slug)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.createdAt,
    description: post.excerpt || post.title,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    publisher: {
      "@type": "Organization",
      name: "APNCODIX",
      url: getSiteUrlString(),
    },
  };

  return (
    <article className="page-marketing page-section-y w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="page-narrow">
        <Link href="/blog" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Back to Blog
        </Link>
        <h1 className="mb-4 font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mb-8 text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
        <div
          className="prose prose-slate max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }}
        />
      </div>
    </article>
  );
}
