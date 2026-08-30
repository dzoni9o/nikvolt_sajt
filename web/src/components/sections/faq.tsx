import { getTranslations } from "next-intl/server";
import type { FaqItem } from "@/lib/mdx";

const FAQ_IDS = ["price", "response", "warranty", "photos", "payment", "area"] as const;

/** The homepage FAQ, in message files so it stays translatable. */
export async function homepageFaqItems(locale: string): Promise<FaqItem[]> {
  const t = await getTranslations({ locale, namespace: "Faq.items" });
  return FAQ_IDS.map((id) => ({ q: t(`${id}.q`), a: t(`${id}.a`) }));
}

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="mt-10 divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
            <h3 className="text-base font-semibold text-foreground sm:text-lg">
              {item.q}
            </h3>
            <span
              aria-hidden
              className="mt-1 shrink-0 text-ink-soft transition-transform group-open:rotate-45"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1v14M1 8h14"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-ink-soft sm:text-base">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

export async function Faq({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Faq" });
  const items = await homepageFaqItems(locale);

  return (
    <section id="faq" className="container-page py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {t("kicker")}
        </p>
        <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>
      </div>
      <FaqList items={items} />
    </section>
  );
}
