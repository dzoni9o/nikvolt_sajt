import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site-config";

/**
 * Identification of the business, for the legal pages.
 *
 * The numbers live in site-config and nowhere else, so the terms page, the
 * privacy policy and all six of their translations cannot drift apart. Labels
 * come from the message files, so the block reads in the visitor's language
 * without the prose around it having to repeat the data.
 *
 * Renders nothing at all while the identifiers are unset — same rule as the
 * address and the Business Profile link. A half-filled legal block is worse
 * than none, because it looks authoritative either way.
 *
 * Two exports rather than one with a `heading` prop: MDX in this setup does
 * not forward attribute expressions to components, so `<Impresum
 * heading={false} />` silently kept the heading. Two names cannot fail
 * quietly. Use `Impresum` where the block needs its own heading (terms) and
 * `ImpresumPodaci` where the surrounding section already has one (privacy).
 */

async function Rows() {
  const t = await getTranslations("Impresum");

  // No address row on purpose. This is a service-area business, the registered
  // seat is a private residence, and the registered name already carries the
  // place. An address here would either be untrue (the Belgrade one, which is
  // where the work happens rather than where the business is registered) or
  // private. Don't add one back without asking Nikola.
  const rows: { label: string; value: string }[] = [
    ...(site.legalName ? [{ label: t("legalName"), value: site.legalName }] : []),
    { label: t("brand"), value: site.name },
    { label: t("reg"), value: site.registrationNumber },
    { label: t("tax"), value: site.taxNumber },
    { label: t("contact"), value: `${site.phoneDisplay} · ${site.email}` },
  ];

  return (
    <>
      <dl className="rounded-2xl border border-border bg-card p-6 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-0.5 border-b border-border py-2.5 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:gap-4"
          >
            <dt className="shrink-0 text-ink-soft sm:w-44">{row.label}</dt>
            <dd className="font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      {!site.vatRegistered ? (
        <p className="mt-3 text-sm text-ink-soft">{t("noVat")}</p>
      ) : null}
    </>
  );
}

const hasIdentifiers = () =>
  Boolean(site.registrationNumber && site.taxNumber);

/** Block with its own heading. For pages where no section introduces it. */
export async function Impresum() {
  if (!hasIdentifiers()) return null;
  const t = await getTranslations("Impresum");

  return (
    <div className="not-prose my-8">
      <h2 className="mb-4 font-display text-2xl font-bold tracking-[-0.02em] text-foreground">
        {t("title")}
      </h2>
      <Rows />
    </div>
  );
}

/** Block without a heading, for a section that already has one. */
export async function ImpresumPodaci() {
  if (!hasIdentifiers()) return null;

  return (
    <div className="not-prose my-6">
      <Rows />
    </div>
  );
}
