import { getTranslations } from "next-intl/server";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getPostBySlug } from "@/lib/blog";
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
  const post = getPostBySlug(locale, slug);
  const t = await getTranslations({ locale, namespace: "Blog" });
  return ogImage({
    kicker: post?.category ?? t("kicker"),
    title: post?.title ?? site.name,
  });
}
