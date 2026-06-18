import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Gauge,
  Zap,
  Shield,
  Wifi,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta.Tools" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}/alati`]),
  );
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/alati`,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}/alati` },
    },
  };
}

type ToolItem = {
  key: string;
  icon: ReactNode;
};

const measuringTools: ToolItem[] = [
  { key: "multimeter", icon: <Gauge className="h-5 w-5" /> },
  { key: "megohmmeter", icon: <Zap className="h-5 w-5" /> },
  { key: "clamp", icon: <Gauge className="h-5 w-5" /> },
  { key: "loop", icon: <Wrench className="h-5 w-5" /> },
  { key: "rcd", icon: <Shield className="h-5 w-5" /> },
];

const handTools: ToolItem[] = [
  { key: "pliers", icon: <Wrench className="h-5 w-5" /> },
  { key: "screwdrivers", icon: <Wrench className="h-5 w-5" /> },
  { key: "stripper", icon: <Wrench className="h-5 w-5" /> },
];

const safetyTools: ToolItem[] = [
  { key: "gloves", icon: <Shield className="h-5 w-5" /> },
  { key: "mat", icon: <Shield className="h-5 w-5" /> },
];

const smartTools: ToolItem[] = [
  { key: "shelly", icon: <Wifi className="h-5 w-5" /> },
  { key: "zigbee", icon: <Wifi className="h-5 w-5" /> },
];

type Category = {
  labelKey: string;
  items: ToolItem[];
};

const categories: Category[] = [
  { labelKey: "measuring", items: measuringTools },
  { labelKey: "hand", items: handTools },
  { labelKey: "safety", items: safetyTools },
  { labelKey: "smart", items: smartTools },
];

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Tools");

  return (
    <div className="container-page py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {t("kicker")}
        </p>
        <h1 className="mt-3 font-display text-balance text-4xl font-bold tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 text-base text-ink-soft sm:text-lg">{t("lead")}</p>
      </header>

      <div className="mt-16 space-y-14">
        {categories.map((cat) => (
          <section key={cat.labelKey}>
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-ink-soft">
              {t(cat.labelKey as "measuring" | "hand" | "safety" | "smart")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-5"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t(`items.${item.key}.title` as Parameters<typeof t>[0])}
                    </h3>
                    <p className="mt-1 text-sm text-ink-soft">
                      {t(`items.${item.key}.description` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20 rounded-3xl border border-border bg-card p-8 md:p-12">
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          {t("ctaTitle")}
        </h2>
        <p className="mt-3 max-w-xl text-base text-ink-soft">{t("ctaLead")}</p>
        <Link
          href="/#assess"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          {t("cta")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
