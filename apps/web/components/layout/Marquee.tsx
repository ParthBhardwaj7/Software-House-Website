const TEXT = "Let's Work Together * ";

type MarqueeProps = {
  websiteName: string;
};

export function Marquee({ websiteName }: MarqueeProps) {
  const brand = websiteName.trim() || "Your brand";

  const spans = Array.from({ length: 12 }).map((_, i) => (
    <span
      key={i}
      className="mx-6 inline-block shrink-0 pb-[0.2em] pt-[0.08em] font-display text-3xl font-semibold leading-[1.22] tracking-tight text-[#0F172A] sm:mx-10 sm:text-4xl sm:leading-[1.2] md:text-5xl md:leading-[1.18]"
    >
      {TEXT}
    </span>
  ));

  return (
    <section className="relative flex min-h-[min(32vh,320px)] flex-col items-center justify-center overflow-x-hidden overflow-y-visible bg-white pb-6 pt-2 sm:min-h-[min(36vh,360px)] sm:pb-8 sm:pt-3">
      <div className="absolute inset-0 z-0 bg-[#F8FAFC]" aria-hidden />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(34,197,94,0.14),transparent_65%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-visible px-6 py-12 sm:px-10 sm:py-14"
        aria-hidden
      >
        <span
          className="max-w-[100%] whitespace-nowrap text-center font-display font-semibold tracking-tight text-[#0F172A]/[0.07] [font-size:clamp(4.5rem,14vw,14rem)] [line-height:1.15]"
          style={{ paddingBlock: "0.1em" }}
        >
          {brand}
        </span>
      </div>

      <div className="relative z-10 flex w-full max-w-[100vw] flex-1 items-center justify-center py-4 sm:py-6">
        <div
          className="w-full overflow-x-hidden overflow-y-visible [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
          style={{ WebkitMaskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)" }}
        >
          <div className="flex w-max animate-marquee items-center pb-2 sm:pb-3">
            {spans}
            {spans}
          </div>
        </div>
      </div>
    </section>
  );
}
