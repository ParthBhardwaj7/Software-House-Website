import Link from "next/link";
import {
  type CustomPageBlock,
  embedWatchUrlToIframeSrc,
  videoUrlToPlayer,
} from "@/lib/custom-page-model";

function Spacer({ size }: { size: "sm" | "md" | "lg" }) {
  const h = size === "sm" ? "h-4" : size === "md" ? "h-8" : "h-14";
  return <div className={h} aria-hidden />;
}

export function CustomPageRenderer({ blocks }: { blocks: CustomPageBlock[] }) {
  return (
    <div className="w-full min-w-0 space-y-10 text-left">
      {blocks.map((b, i) => {
        const key = `${b.type}-${i}`;
        switch (b.type) {
          case "h2":
            return (
              <h2
                key={key}
                className="scroll-mt-24 text-pretty font-display text-2xl font-normal tracking-tight text-[#0F172A] md:text-3xl"
              >
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={key}
                className="scroll-mt-24 text-pretty text-xl font-semibold text-[#0F172A] md:text-2xl"
              >
                {b.text}
              </h3>
            );
          case "paragraph":
            return (
              <p
                key={key}
                className="max-w-prose whitespace-pre-wrap text-pretty text-base leading-relaxed text-[#475569]"
              >
                {b.text}
              </p>
            );
          case "image":
            return (
              <figure key={key} className="mx-auto w-full max-w-full space-y-3">
                <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F1F5F9] shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.url}
                    alt={b.alt?.trim() || ""}
                    className="mx-auto block h-auto max-h-[min(70vh,640px)] w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {b.caption ? (
                  <figcaption className="text-center text-sm text-[#64748B]">{b.caption}</figcaption>
                ) : null}
              </figure>
            );
          case "video": {
            const player = videoUrlToPlayer(b.url);
            return (
              <figure key={key} className="space-y-2">
                {player.kind === "iframe" ? (
                  <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-black shadow-sm">
                    <iframe
                      title={b.caption || "Video"}
                      src={player.src}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : player.kind === "video" ? (
                  <video
                    className="mx-auto max-h-[min(70vh,640px)] w-full rounded-2xl border border-[#E5E7EB] bg-black object-contain shadow-sm"
                    controls
                    playsInline
                    poster={b.posterUrl || undefined}
                    preload="metadata"
                  >
                    <source src={player.src} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-sm text-[#64748B]">
                    <a href={player.href} className="font-medium text-[#22C55E] underline underline-offset-2">
                      Open video link
                    </a>
                  </p>
                )}
                {b.caption ? (
                  <figcaption className="text-center text-sm text-[#64748B]">{b.caption}</figcaption>
                ) : null}
              </figure>
            );
          }
          case "embed": {
            const src = embedWatchUrlToIframeSrc(b.embedUrl);
            if (!src) return null;
            return (
              <div key={key} className="space-y-2">
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-black shadow-sm">
                  <iframe
                    title={b.title || "Embedded media"}
                    src={src}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          }
          case "links":
            return (
              <ul key={key} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-start">
                {b.items.map((item, j) => {
                  const ext = item.external ?? /^https?:\/\//i.test(item.href);
                  const isInternal = item.href.startsWith("/");
                  const className =
                    "inline-flex items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#0F172A] shadow-sm transition hover:border-[#22C55E]/40 hover:bg-[#F0FDF4]";
                  if (isInternal && !ext) {
                    return (
                      <li key={j}>
                        <Link href={item.href} className={className}>
                          {item.label}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={j}>
                      <a
                        href={item.href}
                        className={className}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            );
          case "divider":
            return <hr key={key} className="border-[#E5E7EB]" />;
          case "bulletList":
            return (
              <ul key={key} className="max-w-prose list-disc space-y-2 pl-5 text-[#475569] marker:text-[#22C55E]">
                {b.items.map((t, j) => (
                  <li key={j} className="text-pretty leading-relaxed pl-1">
                    {t}
                  </li>
                ))}
              </ul>
            );
          case "numberedList":
            return (
              <ol key={key} className="max-w-prose list-decimal space-y-2 pl-5 text-[#475569] marker:font-semibold marker:text-[#0F172A]">
                {b.items.map((t, j) => (
                  <li key={j} className="text-pretty leading-relaxed pl-1">
                    {t}
                  </li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                key={key}
                className="max-w-prose border-l-4 border-[#22C55E] bg-white/80 py-4 pl-6 pr-4 text-lg italic text-[#334155] shadow-sm ring-1 ring-[#E5E7EB]/60"
              >
                <p>{b.text}</p>
                {b.attribution ? (
                  <footer className="mt-3 text-sm font-medium not-italic text-[#64748B]">— {b.attribution}</footer>
                ) : null}
              </blockquote>
            );
          case "cta":
            return (
              <div
                key={key}
                className="rounded-2xl border border-[#DCFCE7] bg-gradient-to-br from-[#F0FDF4] to-white p-6 shadow-sm md:p-8"
              >
                {b.title ? <h3 className="text-xl font-bold text-[#0F172A]">{b.title}</h3> : null}
                {b.body ? <p className="mt-2 text-[#475569]">{b.body}</p> : null}
                <div className="mt-4">
                  {b.buttonHref.startsWith("/") ? (
                    <Link
                      href={b.buttonHref}
                      className="inline-flex rounded-full bg-[#22C55E] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16A34A]"
                    >
                      {b.buttonLabel}
                    </Link>
                  ) : (
                    <a
                      href={b.buttonHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full bg-[#22C55E] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16A34A]"
                    >
                      {b.buttonLabel}
                    </a>
                  )}
                </div>
              </div>
            );
          case "spacer":
            return <Spacer key={key} size={b.size} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
