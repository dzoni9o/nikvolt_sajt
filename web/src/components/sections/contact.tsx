import { Phone, Mail, MapPin, Clock, MessageCircle, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/site/logo";
import { site } from "@/lib/site-config";

export async function Contact() {
  const t = await getTranslations("Contact");
  const tHours = await getTranslations("Hours");
  return (
    <section id="contact" className="bg-paper">
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
              {t("kicker")}
            </p>
            <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-base text-ink-soft">{t("lead")}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a href={`tel:${site.phoneTel}`} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:-translate-y-0.5 transition-transform">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background"><Phone className="h-4 w-4" /></span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{t("phoneLabel")}</div>
                  <div className="text-sm font-semibold text-foreground">{site.phoneDisplay}</div>
                </div>
              </a>
              <a href={site.whatsappLink} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:-translate-y-0.5 transition-transform">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emergency text-emergency-foreground"><MessageCircle className="h-4 w-4" /></span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{t("whatsappLabel")}</div>
                  <div className="text-sm font-semibold text-foreground">{t("openConversation")}</div>
                </div>
              </a>
              <a href={site.viberLink} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:-translate-y-0.5 transition-transform">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#665CAC] text-white"><MessageCircle className="h-4 w-4" /></span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{t("viberLabel")}</div>
                  <div className="text-sm font-semibold text-foreground">{t("openConversation")}</div>
                </div>
              </a>
              <a href={`mailto:${site.email}`} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:-translate-y-0.5 transition-transform">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-brand-foreground"><Mail className="h-4 w-4" /></span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{t("emailLabel")}</div>
                  <div className="text-sm font-semibold text-foreground">{site.email}</div>
                </div>
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="h-4 w-4" /> {t("hoursTitle")}
              </h3>
              <ul className="mt-3 grid gap-2 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-foreground">{tHours("alwaysDay")}</span>
                  <span className="font-semibold text-foreground">{tHours("alwaysHours")}</span>
                </li>
              </ul>
            </div>
          </div>

          <BrandPanel />
        </div>
      </div>
    </section>
  );
}

async function BrandPanel() {
  const t = await getTranslations("Contact");
  const tFooter = await getTranslations("Footer");
  const tHours = await getTranslations("Hours");
  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-3xl border border-border bg-foreground p-10 text-background shadow-xl">
      <div
        aria-hidden
        className="absolute -top-24 -right-20 h-[360px] w-[360px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(255, 214, 10, 0.55), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-20 h-[360px] w-[360px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, oklch(0.62 0.22 28 / 0.55), transparent 70%)" }}
      />

      <div className="relative flex h-full flex-col justify-between gap-10">
        <div className="flex justify-center pt-6 sm:pt-10">
          <div className="rounded-3xl border border-background/10 bg-background/5 px-8 py-7 backdrop-blur-sm">
            <Logo size={64} tone="light" variant="stacked" />
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-pretty text-center text-lg font-medium leading-snug text-background sm:text-xl">
            {tFooter("tagline")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-background/10 bg-background/5 p-4 text-left backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-background/60">
                <Zap className="h-3.5 w-3.5 text-brand" /> {tHours("alwaysDay")}
              </div>
              <div className="mt-2 font-display text-3xl font-bold tabular-nums text-background">
                {tHours("alwaysHours")}
              </div>
            </div>
            <div className="rounded-2xl border border-background/10 bg-background/5 p-4 text-left backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-background/60">
                <MapPin className="h-3.5 w-3.5 text-brand" /> {t("mapAreaLabel")}
              </div>
              <div className="mt-2 text-sm font-semibold text-background">
                {t("mapAreaCity", { city: site.city })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
