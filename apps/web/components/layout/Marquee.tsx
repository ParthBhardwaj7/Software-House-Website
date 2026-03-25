"use client";

const TEXT = "Let's Work Together * ";

const spans = Array.from({ length: 12 }).map((_, i) => (
  <span
    key={i}
    className="mx-6 inline-block shrink-0 pb-[0.2em] pt-[0.08em] font-display text-4xl font-semibold leading-[1.22] tracking-tight text-[#0F172A] sm:mx-10 sm:text-5xl sm:leading-[1.2] md:text-6xl md:leading-[1.18] lg:text-7xl lg:leading-[1.16] xl:text-8xl xl:leading-[1.14]"
  >
    {TEXT}
  </span>
));

export function Marquee() {
  return (
    <section className="relative flex min-h-[min(48vh,440px)] flex-col items-center justify-center overflow-x-hidden overflow-y-visible bg-white pb-6 pt-2 sm:pb-8 sm:pt-3">
      {/* Base */}
      <div className="absolute inset-0 z-0 bg-[#F8FAFC]" aria-hidden />

      {/* Soft green glow — between bg and watermark */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(34,197,94,0.14),transparent_65%)]"
        aria-hidden
      />

      {/* HILO watermark — behind marquee text */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-visible px-6 py-16 sm:px-10 sm:py-20"
        aria-hidden
      >
        <span
          className="max-w-[100%] whitespace-nowrap text-center font-display font-semibold tracking-tight text-[#0F172A]/[0.07] [font-size:clamp(6.5rem,18vw,18rem)] [line-height:1.15]"
          style={{ paddingBlock: "0.1em" }}
        >
          HILO
        </span>
      </div>

      {/* Marquee — in front */}
      <div className="relative z-10 flex w-full max-w-[100vw] flex-1 items-center justify-center py-4 sm:py-6">
        {/*
          overflow-x-hidden alone can pair with overflow-y: auto in browsers and clip descenders (g, y, p).
          Extra vertical padding + inner wrapper keeps serif tails visible.
        */}
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
