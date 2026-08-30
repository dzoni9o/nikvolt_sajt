"use client";

import type { ReactNode } from "react";
import { site } from "@/lib/site-config";
import {
  trackContact,
  type ContactChannel,
  type ContactSource,
} from "@/lib/analytics";

const HREF: Record<ContactChannel, string> = {
  phone: `tel:${site.phoneTel}`,
  whatsapp: site.whatsappLink,
  viber: site.viberLink,
  email: `mailto:${site.email}`,
};

/**
 * A contact link that reports the conversion.
 *
 * Most CTAs live in server components, which cannot attach an onClick — this
 * thin client wrapper is what lets a call from the hero be told apart from a
 * call from a location page. That distinction is the whole point: it is how we
 * find out which pages actually earn work.
 */
export function ContactLink({
  channel,
  source,
  className,
  children,
  ariaLabel,
}: {
  channel: ContactChannel;
  source: ContactSource;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const external = channel === "whatsapp";
  return (
    <a
      href={HREF[channel]}
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackContact(channel, source)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
