import { Hero } from "@/components/sections/hero";
import { Emergency } from "@/components/sections/emergency";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FaultAssessmentForm } from "@/components/forms/fault-assessment";
import { Services } from "@/components/sections/services";
import { Pricing } from "@/components/sections/pricing";
import { Gallery } from "@/components/sections/gallery";
import { BlogTeaser } from "@/components/sections/blog-teaser";
import { Reviews } from "@/components/sections/reviews";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/site/json-ld";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
      <Emergency />
      <HowItWorks />
      <FaultAssessmentForm />
      <Services />
      <Pricing />
      <Gallery />
      <BlogTeaser />
      <Reviews />
      <About />
      <Contact />
    </>
  );
}
