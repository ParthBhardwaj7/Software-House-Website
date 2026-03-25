"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Marketing site is light-only; no theme switching. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
