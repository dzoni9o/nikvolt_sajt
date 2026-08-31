import type { ComponentPropsWithoutRef } from "react";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

/**
 * Components handed to MDXRemote.
 *
 * The important one is `a`. A plain <a href="/usluge/uzemljenje"> inside an
 * article carries no locale prefix, so the middleware has to bounce it — an
 * extra redirect on every internal link, and a Russian reader can land on the
 * Serbian page.
 *
 * Convention for authors: internal links in MDX are written in the **internal**
 * route form, using the collection directory name and this file's own slug —
 * /usluge/<slug>, /lokacije/<slug>, /blog/<slug>. next-intl then renders the
 * localized URL (/sr/usluge/…, /en/services/…, /ru/uslugi/…) for whichever
 * locale the article belongs to.
 */

const DYNAMIC_SEGMENTS: Record<string, AppPathname> = {
  usluge: "/usluge/[slug]",
  lokacije: "/lokacije/[slug]",
  blog: "/blog/[slug]",
  pojmovnik: "/pojmovnik/[slug]",
};

const STATIC_ROUTES = new Set<string>([
  "/",
  "/usluge",
  "/lokacije",
  "/blog",
  "/pojmovnik",
  "/alati",
  "/privatnost",
  "/uslovi",
]);

function MdxLink({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (!isInternal) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    );
  }

  const [path, hash] = href.split("#");
  const segments = path.split("/").filter(Boolean);
  const route = segments.length === 2 ? DYNAMIC_SEGMENTS[segments[0]] : undefined;

  if (route) {
    return (
      <Link
        href={{ pathname: route, params: { slug: segments[1] }, ...(hash ? { hash } : {}) } as never}
        {...props}
      />
    );
  }

  if (STATIC_ROUTES.has(path)) {
    return <Link href={{ pathname: path, ...(hash ? { hash } : {}) } as never} {...props} />;
  }

  // Unknown internal path — leave it as a plain anchor rather than guessing.
  return <a href={href} {...props} />;
}

/** A price table must scroll inside itself on a phone, not scroll the page. */
function MdxTable(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table {...props} />
    </div>
  );
}

export const mdxComponents = { a: MdxLink, table: MdxTable };
