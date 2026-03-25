/** Plain-text paragraphs (split on blank lines). React escapes text — no HTML. */
export function FooterManagedPageBody({ text }: { text: string }) {
  const paragraphs = text
    .trim()
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4 text-base leading-relaxed text-[#475569]">
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-wrap text-pretty">
          {p}
        </p>
      ))}
    </div>
  );
}
