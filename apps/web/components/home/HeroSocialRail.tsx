import { getSocialLinkDisplayItems } from "@/lib/social-links-display";
import type { SocialLinks } from "@/lib/public-website-settings";
import { cn } from "@/lib/utils";

type HeroSocialRailProps = {
  links: SocialLinks;
  className?: string;
};

export function HeroSocialRail({ links, className }: HeroSocialRailProps) {
  const items = getSocialLinkDisplayItems(links);
  if (items.length === 0) return null;

  return (
    <nav
      className={cn(
        "pointer-events-auto absolute right-3 top-[56%] z-20 flex -translate-y-1/2 flex-col gap-2 sm:right-4 sm:gap-2.5 lg:top-1/2 lg:right-6 lg:gap-3 xl:right-8",
        className
      )}
      aria-label="Social links"
    >
      {items.map(({ key, href, label, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white/90 text-[#0F172A] shadow-sm backdrop-blur-sm transition hover:border-[#22C55E]/50 hover:bg-white hover:text-[#16A34A] sm:h-10 sm:w-10"
          aria-label={label}
        >
          <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" aria-hidden />
        </a>
      ))}
    </nav>
  );
}
