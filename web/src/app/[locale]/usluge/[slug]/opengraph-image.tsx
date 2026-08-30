import { getTranslations } from "next-intl/server";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getEntry } from "@/lib/mdx";
import { site } from "@/lib/site-config";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = site.name;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const entry = getEntry("usluge", locale, slug);
  const t = await getTranslations({ locale, namespace: "Nav" });
  return ogImage({
    kicker: t("services"),
    title: entry?.h1 ?? site.name,
  });
}
