import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { Emergency } from "@/components/sections/emergency";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FaultAssessmentForm } from "@/components/forms/fault-assessment";
import { Services } from "@/components/sections/services";
import { Pricing } from "@/components/sections/pricing";
import { Faq, homepageFaqItems } from "@/components/sections/faq";
import { BlogTeaser } from "@/components/sections/blog-teaser";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/site/json-ld";
import { areaNames } from "@/lib/areas";
import { faqPage, graph, localBusiness, webSite } from "@/lib/schema";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Meta.Home" });
  const data = graph([
    localBusiness({
      locale,
      description: t("description"),
      areaServed: areaNames(locale),
    }),
    webSite(locale),
    faqPage(await homepageFaqItems(locale)),
  ]);

  return (
    <>
      <JsonLd data={data} />
      <Hero />
      <Emergency />
      <HowItWorks />
      <FaultAssessmentForm />
      <Services />
      <Pricing />
      <Faq locale={locale} />
      <BlogTeaser />
      <About />
      <Contact />
    </>
  );
}
