"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { px: 48, className: "h-12 w-12" },
  md: { px: 64, className: "h-16 w-16" },
  lg: { px: 96, className: "h-24 w-24" },
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

function gradientFromSeed(seed: string): string {
  const hues = [220, 280, 340, 200, 30, 160];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h += seed.charCodeAt(i);
  const hue = hues[h % hues.length];
  return `linear-gradient(135deg, hsl(${hue} 55% 42%) 0%, hsl(${(hue + 40) % 360} 50% 35%) 100%)`;
}

type TeamMemberAvatarProps = {
  name: string;
  photoUrl: string | null;
  size?: keyof typeof sizeMap;
  priority?: boolean;
  className?: string;
  /** Overlap row: ring, pop-up hover (lift + scale + color), optional name label */
  overlapStyle?: boolean;
};

export function TeamMemberAvatar({
  name,
  photoUrl,
  size = "sm",
  priority = false,
  className,
  overlapStyle = true,
}: TeamMemberAvatarProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showImage = Boolean(photoUrl) && !failed;
  const { px, className: dim } = sizeMap[size];
  const initials = useMemo(() => initialsFromName(name), [name]);
  const bg = useMemo(() => gradientFromSeed(name + (photoUrl || "")), [name, photoUrl]);

  const circle = (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-white shadow-sm",
        dim,
        overlapStyle
          ? [
              "grayscale transition-all duration-300 ease-out will-change-transform",
              "group-hover:z-30 group-hover:-translate-y-2.5 group-hover:scale-110 group-hover:grayscale-0 group-hover:shadow-lg",
              "motion-reduce:transition-none motion-reduce:grayscale-0",
              "motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100",
            ]
          : [
              "transition-transform duration-200 will-change-transform [motion-reduce:transition-none]",
              "hover:z-10 hover:scale-110 [motion-reduce:hover]:transform-none",
            ],
        className
      )}
      title={overlapStyle ? undefined : name}
    >
      {!loaded && showImage && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted-foreground/20"
          aria-hidden
        />
      )}
      {showImage ? (
        <Image
          src={photoUrl!}
          alt={name}
          width={px}
          height={px}
          sizes={`${px}px`}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "h-full w-full object-cover",
            !overlapStyle && "grayscale-[0.15]",
            !loaded && "opacity-0",
            loaded && "opacity-100 transition-opacity duration-300"
          )}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(true);
          }}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-sm font-semibold text-white"
          style={{ background: bg }}
          aria-hidden
        >
          {initials}
        </div>
      )}
    </div>
  );

  if (!overlapStyle) {
    return circle;
  }

  return (
    <div className="group relative flex flex-col items-center">
      {circle}
      <span
        className="pointer-events-none absolute left-1/2 top-[calc(100%+0.25rem)] z-30 max-w-[7rem] -translate-x-1/2 text-center text-[10px] font-semibold leading-tight text-foreground opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 sm:text-xs"
        aria-hidden
      >
        {name}
      </span>
    </div>
  );
}
