import { MdxBody } from "@/components/mdx-body";
import { getFormatter, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getEntryByKey } from "@/lib/mdx";

/** Shared shell for the privacy policy and terms pages. */
export async function LegalPage({
  locale,
  documentKey,
}: {
  locale: string;
  documentKey: "privacy" | "terms";
}) {
  const doc = getEntryByKey("pravno", locale, documentKey);
  if (!doc) notFound();

  const t = await getTranslations("Legal");
  const f = await getFormatter();

  return (
    <article className="container-page py-16 md:py-24">
      <header className="max-w-2xl">
        <h1 className="mt-3 font-display text-balance text-2xl font-bold text-foreground sm:text-3xl">
          {doc.title}
        </h1>
        <p className="mt-4 text-base text-ink-soft">{doc.description}</p>
        <p className="mt-6 text-sm text-ink-soft">
          {t("updated", {
            date: f.dateTime(new Date(doc.updated), {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          })}
        </p>
      </header>

      <div className="prose-electric mt-12 max-w-3xl">
        <MdxBody source={doc.content} />
      </div>
    </article>
  );
}
