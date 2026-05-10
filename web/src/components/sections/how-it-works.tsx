import { getTranslations } from "next-intl/server";
import { howItWorksSteps } from "@/lib/content";

export async function HowItWorks() {
  const t = await getTranslations("HowItWorks");
  return (
    <section id="how-it-works" className="container-page py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {t("kicker")}
        </p>
        <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">{t("lead")}</p>
      </div>

      <ol className="mt-12 grid gap-3 md:hidden">
        {howItWorksSteps.map((step, i) => (
          <li key={step} className="relative flex gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-col items-center">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">{step}</span>
              {i < howItWorksSteps.length - 1 && <span className="my-2 w-px flex-1 bg-border" />}
            </div>
            <div className="pb-3">
              <h3 className="text-base font-semibold text-foreground">
                {t(`steps.${step}.title`)}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                {t(`steps.${step}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <ol className="mt-14 hidden md:grid md:grid-cols-4 md:gap-6">
        {howItWorksSteps.map((step, i) => (
          <li key={step} className="relative">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
                {step}
              </span>
              {i < howItWorksSteps.length - 1 && (
                <div className="relative flex-1">
                  <div className="h-px w-full bg-border" />
                  <div className="absolute inset-0 -translate-y-px bg-gradient-to-r from-brand to-transparent opacity-60" />
                </div>
              )}
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-semibold text-foreground">
                {t(`steps.${step}.title`)}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">
                {t(`steps.${step}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
