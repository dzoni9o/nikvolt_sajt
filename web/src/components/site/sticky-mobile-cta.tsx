"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactLink } from "@/components/site/contact-link";

export function StickyMobileCTA() {
  const t = useTranslations("Cta");
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="border-t border-border bg-background/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="grid grid-cols-2 gap-2">
          <ContactLink
            channel="phone"
            source="sticky-mobile"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background"
          >
            <Phone className="h-4 w-4" /> {t("callNow")}
          </ContactLink>
          <ContactLink
            channel="whatsapp"
            source="sticky-mobile"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emergency px-4 py-3 text-sm font-semibold text-emergency-foreground"
          >
            <MessageCircle className="h-4 w-4" /> {t("whatsapp")}
          </ContactLink>
        </div>
      </div>
    </div>
  );
}
