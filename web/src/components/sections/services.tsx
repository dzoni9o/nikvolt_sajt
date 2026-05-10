import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/content";

export function Services() {
  return (
    <section id="services" className="bg-paper">
      <div className="container-page py-20 md:py-28">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Usluge</p>
            <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
              Od jedne utičnice do kompletne instalacije.
            </h2>
          </div>
          <Link href="#assess" className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:underline underline-offset-4 decoration-brand decoration-2">
            Pošalji problem <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.id}
                href="#assess"
                className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  {s.fromPrice && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
                      {s.fromPrice}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{s.description}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  Zatraži ponudu
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
