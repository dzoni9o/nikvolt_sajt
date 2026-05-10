import { ShieldCheck, Award, Wrench, MapPin } from "lucide-react";
import { site } from "@/lib/site-config";

const stats = [
  { label: "Godina iskustva", value: `${site.yearsExperience}` },
  { label: "Završenih intervencija", value: `${site.jobsCompleted.toLocaleString("sr-RS")}+` },
  { label: "Prosečno vreme odziva", value: site.responseTime },
  { label: "Stalnih klijenata", value: "62%" },
];

const credentials = [
  { icon: Award, title: "Licencirani električar", body: "Upisan u Inženjersku komoru, sertifikat dostupan na zahtev." },
  { icon: ShieldCheck, title: "Osiguranje od odgovornosti", body: "Polisa do 5.000.000 RSD po incidentu — možeš da je tražiš na uvid." },
  { icon: Wrench, title: "Kalibrisani instrumenti", body: "Izolacija, FID, impedansa petlje i otpor uzemljenja — kalibrisano svake godine." },
];

export function About() {
  return (
    <section id="about" className="container-page py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">O nama</p>
          <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
            Četrnaest godina iznad nečije table — najčešće tačno pre nego što nešto pregori.
          </h2>
          <p className="mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
            Krenuo sam da menjam instalaciju u svom stanu 2010. zato što su mi
            dva električara dala tri različita problema za isti kvar. Od 2012. radim
            samo ovo. Stanovi, kuće, lokali i lakša industrija — posao u kome zapisnik
            znači više od najjeftinije ponude.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {credentials.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.title} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{c.body}</p>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4" /> Teritorija pokrivanja
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {site.coverage.map((c) => (
                <li key={c} className="rounded-full border border-border bg-paper px-3 py-1.5 text-xs font-medium text-foreground">{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border bg-foreground p-8 text-background shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-background/60">U brojkama</p>
            <dl className="mt-6 grid grid-cols-2 gap-y-8 gap-x-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs text-background/60">{s.label}</dt>
                  <dd className="font-display text-3xl font-bold tabular-nums sm:text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 rounded-2xl border border-background/10 bg-background/5 p-4 text-sm">
              <p className="text-background/80">
                &bdquo;Pokaži mi tablu pre nego što daš ponudu.&ldquo; Cela filozofija. Ako ne
                vidimo, ne dajemo cenu.
              </p>
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand/30 to-transparent blur-2xl"
          />
        </div>
      </div>
    </section>
  );
}
