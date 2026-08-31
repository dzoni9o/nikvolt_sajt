"use client";

import { track } from "@vercel/analytics";

/**
 * Conversion tracking.
 *
 * Organic traffic is not the goal — calls and form submissions are. Without
 * these events there is no way to tell whether a ranking improvement produced
 * any actual work, which makes the rest of the SEO effort unmeasurable.
 *
 * Vercel Analytics events are aggregate and cookieless, so nothing here
 * identifies a visitor and no consent banner is required.
 */

export type ContactChannel = "phone" | "whatsapp" | "viber" | "email";

/** Where on the site the visitor converted from — tells us which pages earn calls. */
export type ContactSource =
  | "navbar"
  | "hero"
  | "sticky-mobile"
  | "emergency-section"
  | "contact-section"
  | "footer"
  | "service-page"
  | "location-page"
  | "blog-sidebar"
  | "glossary"
  | "assessment-form"
  | "not-found";

export function trackContact(channel: ContactChannel, source: ContactSource) {
  track("contact", { channel, source });
}

export function trackAssessmentSubmitted(urgency: string, category: string) {
  track("assessment_submitted", { urgency, category });
}
