import { cn } from "@/lib/utils";

const PALETTE: Record<string, { from: string; to: string; accent: string }> = {
  rcd: { from: "oklch(0.96 0.05 90)", to: "oklch(0.86 0.12 75)", accent: "oklch(0.18 0.02 260)" },
  outlet: { from: "oklch(0.95 0.03 250)", to: "oklch(0.82 0.06 240)", accent: "oklch(0.18 0.02 260)" },
  panel: { from: "oklch(0.94 0.04 30)", to: "oklch(0.78 0.15 35)", accent: "oklch(0.18 0.04 30)" },
  ground: { from: "oklch(0.94 0.04 160)", to: "oklch(0.82 0.08 165)", accent: "oklch(0.18 0.02 260)" },
  default: { from: "oklch(0.96 0.02 90)", to: "oklch(0.85 0.04 80)", accent: "oklch(0.18 0.02 260)" },
};

export function CoverArt({ cover, className }: { cover: string; className?: string }) {
  const p = PALETTE[cover] ?? PALETTE.default;
  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)` }}
      />
      <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`p-${cover}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 16 H32" stroke={p.accent} strokeWidth="0.6" opacity="0.18" />
            <path d="M16 0 V32" stroke={p.accent} strokeWidth="0.6" opacity="0.18" />
          </pattern>
        </defs>
        <rect width="320" height="200" fill={`url(#p-${cover})`} />
        {cover === "rcd" && (
          <g stroke={p.accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="100" y="60" width="120" height="80" rx="6" fill="oklch(1 0 0 / 0.7)" />
            <rect x="118" y="78" width="20" height="44" rx="2" fill={p.accent} />
            <rect x="148" y="78" width="20" height="44" rx="2" fill={p.accent} opacity="0.6" />
            <rect x="178" y="78" width="20" height="44" rx="2" fill={p.accent} opacity="0.3" />
            <path d="M160 30 v20 M160 150 v20" />
          </g>
        )}
        {cover === "outlet" && (
          <g stroke={p.accent} strokeWidth="2" fill="none">
            <circle cx="160" cy="100" r="48" fill="oklch(1 0 0 / 0.75)" />
            <circle cx="148" cy="100" r="5" fill={p.accent} />
            <circle cx="172" cy="100" r="5" fill={p.accent} />
            <rect x="155" y="118" width="10" height="4" rx="1" fill={p.accent} />
          </g>
        )}
        {cover === "panel" && (
          <g stroke={p.accent} strokeWidth="2" fill="none">
            <rect x="80" y="40" width="160" height="120" rx="6" fill="oklch(1 0 0 / 0.7)" />
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x={92 + (i % 4) * 36} y={56 + Math.floor(i / 4) * 50} width="28" height="36" rx="3" fill={p.accent} opacity={0.15 + (i % 3) * 0.15} />
            ))}
          </g>
        )}
        {cover === "ground" && (
          <g stroke={p.accent} strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M160 40 V100" />
            <path d="M120 100 H200" />
            <path d="M132 116 H188" />
            <path d="M144 132 H176" />
            <path d="M156 148 H164" />
            <circle cx="160" cy="40" r="6" fill={p.accent} />
          </g>
        )}
        {cover === "default" && (
          <g stroke={p.accent} strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M120 60 L160 100 L130 100 L170 150" />
          </g>
        )}
      </svg>
    </div>
  );
}
