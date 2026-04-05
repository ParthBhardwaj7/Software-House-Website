import type { LucideIcon } from "lucide-react";
import { Facebook, Github, Instagram, Linkedin, Send, Twitter, Youtube } from "lucide-react";
import type { SocialLinks } from "@/lib/public-website-settings";

export type SocialLinkDisplayItem = {
  key: keyof SocialLinks;
  href: string;
  label: string;
  Icon: LucideIcon;
};

/** Stable order for header, hero rail, and JSON-LD-style lists */
const SOCIAL_LINK_ORDER: {
  key: keyof SocialLinks;
  label: string;
  Icon: LucideIcon;
}[] = [
  { key: "twitter", label: "X (Twitter)", Icon: Twitter },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "youtube", label: "YouTube", Icon: Youtube },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "github", label: "GitHub", Icon: Github },
  { key: "telegram", label: "Telegram", Icon: Send },
];

export function getSocialLinkDisplayItems(links: SocialLinks): SocialLinkDisplayItem[] {
  return SOCIAL_LINK_ORDER.filter(({ key }) => {
    const v = links[key];
    return typeof v === "string" && v.trim().length > 0;
  }).map(({ key, label, Icon }) => ({
    key,
    href: links[key],
    label,
    Icon,
  }));
}
