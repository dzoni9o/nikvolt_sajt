import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Logo } from "./logo";
import { site, navigation } from "@/lib/site-config";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.5 1.6-1.5h1.7V4.3c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.5H7.6V14h2.8v8h3.1Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-paper">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo size={28} />
            <p className="max-w-xs text-sm text-ink-soft">
              {site.tagline}
            </p>
            <div className="flex gap-2 pt-1">
              <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-muted">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href={site.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-muted">
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Sajt</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-foreground/90 hover:text-foreground">{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="text-foreground/90 hover:text-foreground">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Kontakt</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-ink-soft" /><a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a></li>
              <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-ink-soft" /><a href={site.whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-ink-soft" /><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-ink-soft" /><span>{site.address}</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Radno vreme</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {site.hours.map((row) => (
                <li key={row.d} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-ink-soft" />{row.d}</span>
                  <span className="text-ink-soft">{row.h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-ink-soft md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {site.name}. Licencirani električar — {site.city}.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-foreground">Politika privatnosti</Link>
            <Link href="/terms" className="hover:text-foreground">Uslovi korišćenja</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
