import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/site/legal-page";
import { routing } from "@/i18n/routing";
import { getEntryByKey } from "@/lib/mdx";
import { alternatesForRoute } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const doc = getEntryByKey("pravno", locale, "terms");
  return {
    title: doc?.title,
    description: doc?.description,
    alternates: alternatesForRoute("/uslovi", locale),
    robots: { index: false, follow: true },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage locale={locale} documentKey="terms" />;
}
