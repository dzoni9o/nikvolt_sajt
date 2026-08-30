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
  ExternalLink,
  MapPin,
  LayoutGrid,
  BookOpen,
  Calculator,
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

type AppDesign = {
  bg: string;
  bgGrid: boolean;
  text: string;
  textSoft: string;
  accent: string;
  iconBg: string;
  border: string;
};

type WebApp = {
  key: "ponude" | "tabla" | "dnevnik" | "calculator";
  href: string;
  subdomain: string;
  icon: ReactNode;
  design: AppDesign;
};

const webApps: WebApp[] = [
  {
    key: "ponude",
    href: "https://ponude.nikvolt.com/",
    subdomain: "ponude.nikvolt.com",
    icon: <MapPin className="h-6 w-6" />,
    design: {
      bg: "#eae4d2",
      bgGrid: true,
      text: "#1a2415",
      textSoft: "#4d5f47",
      accent: "#8a6200",
      iconBg: "rgba(50,90,55,0.12)",
      border: "rgba(60,95,60,0.18)",
    },
  },
  {
    key: "tabla",
    href: "https://tabla.nikvolt.com/",
    subdomain: "tabla.nikvolt.com",
    icon: <LayoutGrid className="h-6 w-6" />,
    design: {
      bg: "#20251b",
      bgGrid: false,
      text: "#f4ecd8",
      textSoft: "rgba(244,236,216,0.52)",
      accent: "#ffcf21",
      iconBg: "rgba(255,207,33,0.12)",
      border: "rgba(235,224,190,0.1)",
    },
  },
  {
    key: "dnevnik",
    href: "https://dnevnik.nikvolt.com/",
    subdomain: "dnevnik.nikvolt.com",
    icon: <BookOpen className="h-6 w-6" />,
    design: {
      bg: "#2d3528",
      bgGrid: false,
      text: "#e8e0cc",
      textSoft: "rgba(232,224,204,0.52)",
      accent: "#ffcf21",
      iconBg: "rgba(255,207,33,0.1)",
      border: "rgba(232,224,204,0.08)",
    },
  },
  {
    key: "calculator",
    href: "https://calculator.nikvolt.com/",
    subdomain: "calculator.nikvolt.com",
    icon: <Calculator className="h-6 w-6" />,
    design: {
      bg: "#faf9f5",
      bgGrid: false,
      text: "#050505",
      textSoft: "#5a554f",
      accent: "#8a6c00",
      iconBg: "rgba(0,0,0,0.06)",
      border: "rgba(0,0,0,0.08)",
    },
  },
];

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
  labelKey: "measuring" | "hand" | "safety" | "smart";
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

      {/* App cards — hero */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {webApps.map((app) => (
          <a
            key={app.key}
            href={app.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              backgroundColor: app.design.bg,
              border: `1px solid ${app.design.border}`,
              ...(app.design.bgGrid
                ? {
                    backgroundImage:
                      "linear-gradient(rgba(50,90,55,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(50,90,55,0.09) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }
                : {}),
            }}
          >
            <div className="flex min-h-[272px] flex-col gap-0 p-7 sm:p-8">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: app.design.iconBg,
                    color: app.design.text,
                  }}
                >
                  {app.icon}
                </span>
                <span
                  className="rounded-full px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide"
                  style={{
                    backgroundColor: app.design.iconBg,
                    color: app.design.textSoft,
                  }}
                >
                  {app.subdomain}
                </span>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Name + description */}
              <div>
                <h2
                  className="font-display text-2xl font-bold leading-tight sm:text-3xl"
                  style={{ color: app.design.text }}
                >
                  {t(`apps.${app.key}.title` as Parameters<typeof t>[0])}
                </h2>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: app.design.textSoft }}
                >
                  {t(`apps.${app.key}.description` as Parameters<typeof t>[0])}
                </p>
              </div>

              {/* Link */}
              <div
                className="mt-5 flex items-center gap-1.5 text-sm font-semibold transition-all duration-150 group-hover:gap-2.5"
                style={{ color: app.design.accent }}
              >
                {t("appsOpen")}
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Physical tools — secondary */}
      <div className="mt-20 border-t border-border pt-16">
        <div className="space-y-14">
          {categories.map((cat) => (
            <section key={cat.labelKey}>
              <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-ink-soft">
                {t(cat.labelKey)}
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
      </div>

      {/* CTA */}
      <div className="mt-20 rounded-3xl border border-border bg-card p-8 md:p-12">
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          {t("ctaTitle")}
        </h2>
        <p className="mt-3 max-w-xl text-base text-ink-soft">{t("ctaLead")}</p>
        <Link
          href={{ pathname: "/", hash: "assess" }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          {t("cta")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
