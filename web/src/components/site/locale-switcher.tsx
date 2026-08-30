"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type StaticAppPathname, type Locale } from "@/i18n/routing";
import type { SlugMap } from "@/lib/mdx";
import { Globe } from "lucide-react";
import { useTransition } from "react";

const nativeLabels: Record<Locale, string> = {
  sr: "Srpski",
  en: "English",
  ru: "Русский",
};

/** Where to land when the current entry has no translation in the target locale. */
const INDEX_FALLBACK: Record<string, StaticAppPathname> = {
  "/blog/[slug]": "/blog",
  "/usluge/[slug]": "/usluge",
  "/lokacije/[slug]": "/lokacije",
};

export function LocaleSwitcher({
  className,
  slugMap = {},
}: {
  className?: string;
  slugMap?: SlugMap;
}) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    const currentSlug = typeof params.slug === "string" ? params.slug : undefined;

    // Static route — the pathname template is the same in every locale.
    if (!currentSlug) {
      router.replace({ pathname: pathname as StaticAppPathname }, { locale: next });
      return;
    }

    const translatedSlug = slugMap[pathname]?.[currentSlug]?.[next];

    // No translation of this entry: land on the section index rather than on a
    // 404, or on the same text in the wrong language.
    if (!translatedSlug) {
      const fallback = INDEX_FALLBACK[pathname];
      router.replace({ pathname: fallback ?? "/" }, { locale: next });
      return;
    }

    router.replace(
      {
        pathname: pathname as "/blog/[slug]",
        params: { slug: translatedSlug },
      },
      { locale: next },
    );
  }

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
          startTransition(() => switchTo(next));
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
