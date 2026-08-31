"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The icon is switched by CSS, not by state.
 *
 * ThemeProvider sets attribute="class", so the `dark` class lands on <html>
 * and the `dark:` variant can pick the right icon on the server render. The
 * usual next-themes dance — a `mounted` flag set from an effect — is both a
 * cascading-render lint error and the reason this button used to show an empty
 * square until hydration.
 *
 * The label stays constant rather than describing the target theme: a toggle
 * announcing "switch to light" flips its own name on every press, which reads
 * badly in a screen reader.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("Ally");

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={t("themeToggle")}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      <Sun className="hidden h-4 w-4 dark:block" />
      <Moon className="h-4 w-4 dark:hidden" />
    </button>
  );
}
