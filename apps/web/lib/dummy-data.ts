/** Dummy content for visual QA when API is empty or during development (min 6 items per list where applicable) */

export const DUMMY_SITE_SETTINGS = {
  websiteName: "HILO",
  contactEmail: "hello@hilo.agency",
  phoneNumber: "+91 98765 43210",
  tagline: "Modern software for ambitious teams.",
  addressLine: "Bengaluru, India",
} as const;

export const DUMMY_PROJECTS = [
  {
    id: "dummy-1",
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "Full-stack marketplace with real-time inventory, payments, and admin dashboard.",
    category: "Web App",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    liveUrl: "https://example.com",
    techStack: ["Next.js", "PostgreSQL", "Stripe"],
  },
  {
    id: "dummy-2",
    slug: "ai-dashboard",
    title: "AI Analytics Dashboard",
    description: "Enterprise analytics with ML-powered insights and custom reporting.",
    category: "AI",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    liveUrl: "https://example.com",
    techStack: ["React", "Python", "TensorFlow"],
  },
  {
    id: "dummy-3",
    slug: "mobile-banking",
    title: "Mobile Banking App",
    description: "Secure finance app with biometric auth and instant transfers.",
    category: "Mobile",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    liveUrl: null,
    techStack: ["React Native", "Node.js"],
  },
  {
    id: "dummy-4",
    slug: "saas-crm",
    title: "B2B CRM Suite",
    description: "Pipeline automation, email sequences, and analytics for sales teams.",
    category: "SaaS",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    liveUrl: "https://example.com",
    techStack: ["Next.js", "Prisma", "tRPC"],
  },
  {
    id: "dummy-5",
    slug: "iot-fleet",
    title: "IoT Fleet Monitor",
    description: "Real-time device telemetry, alerts, and fleet health dashboards.",
    category: "IoT",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    liveUrl: null,
    techStack: ["NestJS", "MQTT", "Grafana"],
  },
  {
    id: "dummy-6",
    slug: "design-system",
    title: "Design System & Docs",
    description: "Component library, Storybook, and accessibility audits for a fintech product.",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    liveUrl: "https://example.com",
    techStack: ["React", "Tailwind", "Storybook"],
  },
];

export const DUMMY_TESTIMONIALS = [
  {
    id: "dummy-t1",
    name: "Sarah Mitchell",
    role: "CTO",
    company: "Northwind Labs",
    quote:
      "HILO delivered our platform ahead of schedule. Communication was clear and the quality exceeded expectations.",
    avatarUrl: null,
    rating: 5,
    date: "September 2025",
  },
  {
    id: "dummy-t2",
    name: "James Park",
    role: "Founder",
    company: "StartupFlow",
    quote:
      "From discovery to launch, the team was professional. Our conversion rate improved within weeks.",
    avatarUrl: null,
    rating: 5,
    date: "August 2025",
  },
  {
    id: "dummy-t3",
    name: "Elena Rodriguez",
    role: "Product Lead",
    company: "ScaleUp Inc",
    quote:
      "Best agency we’ve worked with. They understood our vision and shipped a product our users love.",
    avatarUrl: null,
    rating: 5,
    date: "July 2025",
  },
  {
    id: "dummy-t4",
    name: "Rilind",
    role: "Design / Creative Lead",
    company: "Studio North",
    quote:
      "Clear process, sharp craft, and zero drama. They turned a vague brief into something our users actually enjoy using every day.",
    avatarUrl: null,
    rating: 5,
    date: "June 2025",
  },
  {
    id: "dummy-t5",
    name: "Tomas",
    role: "Engineering Manager",
    company: "CloudForge",
    quote:
      "Solid architecture, fast iterations, and honest timelines. The handoff to our internal team was painless.",
    avatarUrl: null,
    rating: 5,
    date: "May 2025",
  },
  {
    id: "dummy-t6",
    name: "Priya Sharma",
    role: "Head of Product",
    company: "FinEdge",
    quote:
      "From discovery to launch, HILO felt like an extension of our team. Metrics moved within the first month.",
    avatarUrl: null,
    rating: 5,
    date: "April 2025",
  },
];

export const DUMMY_SERVICES = [
  {
    id: "s1",
    title: "Web & Mobile App Development",
    description: "End-to-end product engineering with modern stacks and scalable architecture.",
    problem: "Legacy stack slowing releases and poor mobile UX.",
    solution: "Next.js + React Native, CI/CD, and observability from day one.",
    outcome: "40% faster ship cadence in Q1 post-launch.",
  },
  {
    id: "s2",
    title: "Digital Marketing Services",
    description: "SEO, content, and performance campaigns to grow your audience.",
    problem: "Organic traffic flat and unclear attribution.",
    solution: "Content system, technical SEO, and conversion experiments.",
    outcome: "2× qualified leads within 90 days.",
  },
  {
    id: "s3",
    title: "AI Integration",
    description: "Embed LLMs, automation, and smart features into your existing products.",
    problem: "Manual workflows eating team hours.",
    solution: "RAG pipelines, guardrails, and human-in-the-loop review.",
    outcome: "60% reduction in support tickets for tier-1 queries.",
  },
  {
    id: "s4",
    title: "Automation",
    description: "Workflow automation that saves hours and reduces manual errors.",
    problem: "Teams copy-pasting between spreadsheets and tools.",
    solution: "Zapier/Make, custom bots, and event-driven pipelines.",
    outcome: "15+ hours/week saved per team.",
  },
  {
    id: "s5",
    title: "Machine Learning & Cloud Computing",
    description: "ML pipelines, MLOps, and cloud-native infrastructure on AWS/GCP.",
    problem: "Models stuck in notebooks; infra not production-ready.",
    solution: "Kubeflow, monitoring, and cost-aware autoscaling.",
    outcome: "Reliable inference with predictable monthly spend.",
  },
  {
    id: "s6",
    title: "DevOps & SRE",
    description: "CI/CD, observability, incident response, and platform reliability.",
    problem: "Frequent outages and slow deploys.",
    solution: "GitOps, SLOs, runbooks, and on-call rotation design.",
    outcome: "99.9% uptime target with faster MTTR.",
  },
];

/** Scroll timeline on /what-we-deliver */
export const DELIVERY_STEPS = [
  {
    num: "01",
    title: "Discovery",
    body: "We align on goals, users, and constraints — workshops, audits, and a clear success definition before a single line of code.",
  },
  {
    num: "02",
    title: "Research & strategy",
    body: "Market, stack, and risk assessment. You get a roadmap, milestones, and trade-offs documented so decisions stay fast and honest.",
  },
  {
    num: "03",
    title: "Design systems & UX",
    body: "Flows, wireframes, and a cohesive UI language. Accessibility and performance are baked in, not bolted on later.",
  },
  {
    num: "04",
    title: "Build & integrate",
    body: "Iterative delivery with reviews, staging environments, and integrations that match your ops — APIs, auth, payments, and data.",
  },
  {
    num: "05",
    title: "QA & launch",
    body: "Automated checks, manual edge-case passes, and a calm go-live plan — rollbacks and monitoring included.",
  },
  {
    num: "06",
    title: "Handoff & growth",
    body: "Docs, training, and a path for v2. We stay available for enhancements so momentum doesn’t stop at launch.",
  },
] as const;

export const DUMMY_BLOG_POSTS = [
  {
    id: "b1",
    slug: "nextjs-app-router-guide",
    title: "Building with Next.js App Router",
    excerpt: "Layouts, loading UI, and data fetching patterns we use in production.",
    content:
      "The App Router brings nested layouts, streaming, and server components. Start with route groups for marketing vs app shells.\n\nUse loading.tsx for instant feedback and error.tsx for boundaries.\n\nFetch in server components by default; reach for client state only when needed.",
    createdAt: "2025-09-15T10:00:00.000Z",
  },
  {
    id: "b2",
    slug: "prisma-postgres-tips",
    title: "Prisma + PostgreSQL at scale",
    excerpt: "Indexes, connection pooling, and migration hygiene for growing apps.",
    content:
      "Use connection poolers (PgBouncer) in serverless. Add indexes for foreign keys you filter on.\n\nKeep migrations small and reversible. Use prisma migrate dev in staging before prod.",
    createdAt: "2025-09-01T10:00:00.000Z",
  },
  {
    id: "b3",
    slug: "ai-rag-production",
    title: "RAG in production: pitfalls and fixes",
    excerpt: "Chunking, embeddings refresh, and evaluation beyond demo quality.",
    content:
      "Monitor retrieval hit rate. Re-embed when docs change. Add citation UI so users trust answers.\n\nUse small models for routing and larger for synthesis to control cost.",
    createdAt: "2025-08-20T10:00:00.000Z",
  },
  {
    id: "b4",
    slug: "design-systems-2025",
    title: "Design systems that teams actually adopt",
    excerpt: "Tokens, documentation, and governance without slowing designers down.",
    content:
      "Co-locate Figma and code tokens. Ship Storybook with visual regression.\n\nTreat breaking changes as semver for UI packages.",
    createdAt: "2025-08-05T10:00:00.000Z",
  },
  {
    id: "b5",
    slug: "nestjs-api-patterns",
    title: "NestJS API patterns we swear by",
    excerpt: "Modules, DTOs, guards, and testing strategy for maintainable backends.",
    content:
      "One feature per module. Validate with class-validator. E2E tests against a test DB.\n\nUse interceptors for logging and timeouts globally.",
    createdAt: "2025-07-22T10:00:00.000Z",
  },
  {
    id: "b6",
    slug: "performance-web-vitals",
    title: "Web Vitals that move the needle",
    excerpt: "LCP, INP, and CLS — what we measure before every launch.",
    content:
      "Optimize images with next/image. Defer third-party scripts. Split heavy client bundles.\n\nSet performance budgets in CI.",
    createdAt: "2025-07-10T10:00:00.000Z",
  },
];

export const DUMMY_FAQS = [
  {
    id: "faq1",
    question: "What is your typical project timeline?",
    answer:
      "Small MVPs often ship in 8–12 weeks. Larger platforms are phased; we agree milestones and demos every two weeks.",
  },
  {
    id: "faq2",
    question: "Do you work with startups and enterprises?",
    answer:
      "Yes. We scope engagements to your stage — from seed-stage MVPs to compliance-heavy enterprise rollouts.",
  },
  {
    id: "faq3",
    question: "How do you price engagements?",
    answer:
      "Fixed phases for discovery and MVP, then retainer or T&M for iteration. We share estimates upfront and track burn transparently.",
  },
  {
    id: "faq4",
    question: "Can you integrate with our existing stack?",
    answer:
      "Absolutely. We routinely plug into REST/GraphQL APIs, SSO, CRMs, and data warehouses you already run.",
  },
  {
    id: "faq5",
    question: "Where is the team located?",
    answer:
      "Core team is in India with overlap hours for US and EU clients. We use async updates and weekly syncs.",
  },
  {
    id: "faq6",
    question: "What happens after launch?",
    answer:
      "We offer SLAs for maintenance, monitoring, and feature increments — or train your team for full handoff.",
  },
];

export const DUMMY_TEAM_MEMBERS = [
  {
    id: "tm1",
    name: "Aarav Mehta",
    role: "CEO & Co-founder",
    bio: "Ex-product lead; focuses on strategy, partnerships, and delivery quality.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
  {
    id: "tm2",
    name: "Neha Kapoor",
    role: "Head of Engineering",
    bio: "Backend and platform; previously scaled systems serving millions of daily users.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    id: "tm3",
    name: "Chris Lee",
    role: "Lead Designer",
    bio: "Product design, design systems, and design–dev handoff obsessives.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    id: "tm4",
    name: "Sneha Reddy",
    role: "Product Manager",
    bio: "Turns ambiguous goals into roadmaps, metrics, and shippable slices.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
  {
    id: "tm5",
    name: "Marcus Weber",
    role: "ML Engineer",
    bio: "LLM apps, evals, and production inference — not just notebooks.",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
  },
  {
    id: "tm6",
    name: "Divya Nair",
    role: "Customer Success",
    bio: "Onboarding, training, and making sure launches stick after go-live.",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];
