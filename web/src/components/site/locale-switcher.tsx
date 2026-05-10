"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useTransition } from "react";

const nativeLabels: Record<Locale, string> = {
  sr: "Srpski",
  en: "English",
  ru: "Русский",
};

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <label
      className={`relative inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted ${
        className ?? ""
      }`}
    >
      <Globe className="h-4 w-4 text-ink-soft" aria-hidden />
      <span className="sr-only">{t("label")}</span>
      <select
        aria-label={t("label")}
        value={locale}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as Locale;
          startTransition(() => router.replace(pathname, { locale: next }));
        }}
        className="cursor-pointer appearance-none bg-transparent pr-1 font-medium outline-none"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {nativeLabels[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
