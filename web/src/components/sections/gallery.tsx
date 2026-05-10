"use client";

import { useState } from "react";
import { gallery } from "@/lib/content";
import { ArrowLeftRight } from "lucide-react";

export function Gallery() {
  return (
    <section id="gallery" className="bg-paper">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Pre / Posle</p>
          <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
            Stvarne instalacije. Bez stock fotografija.
          </h2>
          <p className="mt-4 text-base text-ink-soft">
            Pomeri klizač i uporedi šta smo zatekli sa onim što smo ostavili iza sebe.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gallery.map((g) => (
            <BeforeAfterCard key={g.id} item={g} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterCard({ item }: { item: typeof gallery[number] }) {
  const [pos, setPos] = useState(50);
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div
        className="group relative aspect-[4/3] w-full select-none overflow-hidden bg-muted"
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const target = e.currentTarget as HTMLElement;
          if (!target.hasPointerCapture(e.pointerId)) return;
          const rect = target.getBoundingClientRect();
          const next = ((e.clientX - rect.left) / rect.width) * 100;
          setPos(Math.max(0, Math.min(100, next)));
        }}
        onPointerUp={(e) => {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        }}
      >
        <FauxImage label="Pre" tone="warn" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <FauxImage label="Posle" tone="ok" />
        </div>

        <div
          className="absolute inset-y-0 z-10 flex w-px items-center justify-center bg-background"
          style={{ left: `${pos}%` }}
          aria-hidden
        >
          <button
            type="button"
            className="absolute grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-background text-foreground shadow ring-1 ring-border"
            aria-label="Povuci za poređenje"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">Pre</span>
        <span className="absolute right-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-background">Posle</span>
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
        <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
        {item.location && <p className="mt-3 text-xs font-medium text-ink-soft">{item.location}</p>}
      </div>
    </article>
  );
}

function FauxImage({ label, tone }: { label: string; tone: "ok" | "warn" }) {
  const ok = tone === "ok";
  return (
    <div
      className="absolute inset-0"
      style={{
        background: ok
          ? "linear-gradient(135deg, oklch(0.94 0.02 90) 0%, oklch(0.85 0.05 80) 100%)"
          : "linear-gradient(135deg, oklch(0.32 0.02 60) 0%, oklch(0.18 0.04 30) 100%)",
      }}
    >
      <svg
        viewBox="0 0 240 180"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {ok ? (
          <g stroke="oklch(0.18 0.02 260 / 0.7)" strokeWidth="1.6" fill="none">
            <rect x="40" y="30" width="160" height="120" rx="6" fill="oklch(0.99 0.005 95)" />
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={i} x={50 + (i % 3) * 53} y={45 + Math.floor(i / 3) * 50} width="40" height="32" rx="3" fill="oklch(0.92 0.02 90)" />
            ))}
            {Array.from({ length: 3 }).map((_, i) => (
              <line key={i} x1="50" y1={140 + i * 5} x2="190" y2={140 + i * 5} stroke="oklch(0.45 0.02 260 / 0.5)" />
            ))}
          </g>
        ) : (
          <g>
            <rect x="40" y="30" width="160" height="120" rx="6" fill="oklch(0.18 0.04 30 / 0.4)" stroke="oklch(0.62 0.22 28 / 0.7)" />
            {Array.from({ length: 14 }).map((_, i) => {
              const x = 50 + (i % 5) * 28;
              const y = 50 + Math.floor(i / 5) * 35;
              return (
                <path
                  key={i}
                  d={`M${x} ${y} q${10 + (i % 3) * 4} ${-15 - (i % 4) * 3} ${20} ${5 + (i % 5)} t${20} ${10}`}
                  stroke="oklch(0.65 0.18 35 / 0.7)"
                  strokeWidth="1.2"
                  fill="none"
                />
              );
            })}
          </g>
        )}
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
