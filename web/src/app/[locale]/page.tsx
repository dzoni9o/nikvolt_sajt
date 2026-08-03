import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { Emergency } from "@/components/sections/emergency";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FaultAssessmentForm } from "@/components/forms/fault-assessment";
import { Services } from "@/components/sections/services";
import { Pricing } from "@/components/sections/pricing";
import { BlogTeaser } from "@/components/sections/blog-teaser";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/site/json-ld";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd />
      <Hero />
      <Emergency />
      <HowItWorks />
      <FaultAssessmentForm />
      <Services />
      <Pricing />
      <BlogTeaser />
      <About />
      <Contact />
    </>
  );
}
