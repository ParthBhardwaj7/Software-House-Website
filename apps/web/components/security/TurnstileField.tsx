"use client";

import { forwardRef, useEffect, useState } from "react";
import type { TurnstileProps } from "@marsidev/react-turnstile";
import type { TurnstileWidgetHandle } from "@/lib/turnstile-ref";

type WidgetSize = "normal" | "compact" | "flexible" | "invisible";

type Props = {
  onToken: (token: string | null) => void;
  theme?: "light" | "dark" | "auto";
  size?: WidgetSize;
  className?: string;
};

type LoadedTurnstile = React.ForwardRefExoticComponent<
  TurnstileProps & React.RefAttributes<TurnstileWidgetHandle | undefined>
>;

export const TurnstileField = forwardRef<TurnstileWidgetHandle, Props>(function TurnstileField(
  { onToken, theme = "auto", size = "normal", className },
  ref
) {
  const [Turnstile, setTurnstile] = useState<LoadedTurnstile | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("@marsidev/react-turnstile").then((mod) => {
      if (!cancelled) setTurnstile(() => mod.Turnstile as LoadedTurnstile);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;
  if (!Turnstile) return null;

  return (
    <Turnstile
      ref={ref}
      siteKey={siteKey}
      className={className}
      onSuccess={(t) => onToken(t)}
      onExpire={() => onToken(null)}
      onError={() => onToken(null)}
      options={{ theme, size }}
    />
  );
});
