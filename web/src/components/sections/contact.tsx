import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { site } from "@/lib/site-config";

export function Contact() {
  return (
    <section id="contact" className="bg-paper">
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Kontakt</p>
            <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
              Izaberi kanal koji ti najbolje odgovara u ovom trenutku.
            </h2>
            <p className="mt-4 max-w-md text-base text-ink-soft">
              Telefon za hitne slučajeve. WhatsApp ili Viber za slike i ponudu. Email ako može da čeka do sutra.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a href={`tel:${site.phoneTel}`} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:-translate-y-0.5 transition-transform">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background"><Phone className="h-4 w-4" /></span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Telefon</div>
                  <div className="text-sm font-semibold text-foreground">{site.phoneDisplay}</div>
                </div>
              </a>
              <a href={site.whatsappLink} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:-translate-y-0.5 transition-transform">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emergency text-emergency-foreground"><MessageCircle className="h-4 w-4" /></span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">WhatsApp</div>
                  <div className="text-sm font-semibold text-foreground">Otvori razgovor</div>
                </div>
              </a>
              <a href={site.viberLink} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:-translate-y-0.5 transition-transform">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#665CAC] text-white"><MessageCircle className="h-4 w-4" /></span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Viber</div>
                  <div className="text-sm font-semibold text-foreground">Otvori razgovor</div>
                </div>
              </a>
              <a href={`mailto:${site.email}`} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:-translate-y-0.5 transition-transform">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-brand-foreground"><Mail className="h-4 w-4" /></span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Email</div>
                  <div className="text-sm font-semibold text-foreground">{site.email}</div>
                </div>
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="h-4 w-4" /> Radno vreme
              </h3>
              <ul className="mt-3 grid gap-2 text-sm">
                {site.hours.map((row) => (
                  <li key={row.d} className="flex items-center justify-between">
                    <span className="text-foreground">{row.d}</span>
                    <span className="text-ink-soft">{row.h}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-start gap-2 text-xs text-ink-soft">
                <MapPin className="mt-0.5 h-3.5 w-3.5" /> Radionica · {site.address}
              </p>
            </div>
          </div>

          <div className="relative h-full min-h-[420px] overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <FauxMap />
          </div>
        </div>
      </div>
    </section>
  );
}

function FauxMap() {
  return (
    <div className="relative h-full min-h-[420px] w-full">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(120deg, oklch(0.97 0.01 80) 0%, oklch(0.93 0.02 90) 100%),
            radial-gradient(circle at 30% 40%, oklch(0.78 0.17 75 / 0.18), transparent 60%)
          `,
        }}
      />
      <svg viewBox="0 0 600 480" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g stroke="oklch(0.18 0.02 260 / 0.25)" strokeWidth="1.5" fill="none">
          <path d="M-20 80 Q 200 60 380 140 T 700 220" />
          <path d="M-20 200 Q 180 160 340 240 T 700 300" />
          <path d="M-20 320 Q 220 300 400 360 T 700 420" />
          <path d="M120 -10 Q 160 200 220 380 T 280 520" />
          <path d="M340 -10 Q 380 220 420 360 T 460 520" />
        </g>
        <g fill="oklch(0.18 0.02 260 / 0.05)" stroke="oklch(0.18 0.02 260 / 0.18)">
          <rect x="80" y="60" width="80" height="50" rx="4" />
          <rect x="180" y="40" width="60" height="40" rx="4" />
          <rect x="260" y="100" width="80" height="50" rx="4" />
          <rect x="370" y="60" width="100" height="60" rx="4" />
          <rect x="120" y="200" width="90" height="60" rx="4" />
          <rect x="240" y="220" width="60" height="40" rx="4" />
          <rect x="320" y="180" width="120" height="80" rx="4" />
          <rect x="100" y="320" width="80" height="50" rx="4" />
          <rect x="200" y="340" width="100" height="60" rx="4" />
          <rect x="320" y="320" width="80" height="50" rx="4" />
        </g>
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute inset-0 -m-4 animate-ping rounded-full bg-emergency/30" />
          <div className="relative grid h-12 w-12 place-items-center rounded-full bg-emergency text-emergency-foreground shadow-lg">
            <MapPin className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-border bg-background/85 p-4 backdrop-blur">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Područje rada</div>
        <div className="mt-1 text-sm font-semibold text-foreground">{site.city} i okolne opštine</div>
        <p className="mt-1 text-xs text-ink-soft">Izlasci se obično zakazuju u roku od 60 minuta od potvrde.</p>
      </div>
    </div>
  );
}
