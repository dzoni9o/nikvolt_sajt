import { Link } from "@/i18n/navigation";
import type { SeoHref } from "@/lib/seo";

/**
 * Vidljive mrvice.
 *
 * JSON-LD za njih postoji odavno (`breadcrumbs()` u lib/schema.ts), ali se na
 * ekranu nisu videle nigde — bio je samo „← ceo pojmovnik" nazad-link. Čovek
 * koji sa Gugla sleti na jedan od 44 pojma nije imao načina da sazna gde je.
 *
 * Prima isti niz koji ide u JSON-LD, pa se vidljiva putanja i ona koju čita
 * Google ne mogu razići.
 */
export function Breadcrumbs({
  trail,
}: {
  trail: { name: string; href: SeoHref }[];
}) {
  if (trail.length < 2) return null;
  const path = trail.slice(0, -1);
  const current = trail[trail.length - 1];

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {path.map((step) => (
          <li key={step.name} className="flex items-center gap-1.5">
            <Link href={step.href as never} className="hover:text-foreground">
              {step.name}
            </Link>
            <span aria-hidden>›</span>
          </li>
        ))}
        <li className="text-foreground">{current.name}</li>
      </ol>
    </nav>
  );
}
