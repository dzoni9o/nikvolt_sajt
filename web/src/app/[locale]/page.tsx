import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { Emergency } from "@/components/sections/emergency";
import { FaultAssessmentForm } from "@/components/forms/fault-assessment";
import { Services } from "@/components/sections/services";
import { Pricing } from "@/components/sections/pricing";
import { Radovi } from "@/components/sections/radovi";
import { Faq, homepageFaqItems } from "@/components/sections/faq";
import { About } from "@/components/sections/about";
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
      {/* Redosled prati čoveka koji je upravo ostao bez struje: prvo ko si i
          kako te zove, pa šta mu se dešava, pa koliko košta, pa dokaz da je
          posao stvaran, pa ko dolazi. Forma nije sklonjena nego spuštena ispod
          svega toga — za tri meseca je donela dva do pet zahteva.

          Izašle su tri sekcije, 4.033 px na telefonu: „Kako funkcioniše"
          (renderovala se dvaput, jednom za telefon jednom za monitor), blog na
          naslovnoj, i „Kontakt" koji je duplirao podnožje i zaglavlje. */}
      <Hero />
      <Emergency locale={locale} />
      <Pricing />
      <Radovi />
      <About />
      <Services />
      <FaultAssessmentForm />
      <Faq locale={locale} />
    </>
  );
}
