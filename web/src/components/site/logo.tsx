import Link from "next/link";
import { cn } from "@/lib/utils";

type Tone = "dark" | "light";
type Variant = "horizontal" | "stacked" | "mark";

const COLORS = {
  ink: "#0A0A0A",
  paper: "#FFFFFF",
  yellow: "#FFD60A",
} as const;

function Mark({ size = 32, tone = "dark" }: { size?: number; tone?: Tone }) {
  const body = tone === "light" ? COLORS.paper : COLORS.ink;
  const face = tone === "light" ? COLORS.ink : COLORS.paper;
  return (
    <svg
      viewBox="0 0 100 110"
      width={size}
      height={size * 1.1}
      role="img"
      aria-label="nik volt"
      className="shrink-0"
    >
      <rect x="20" y="38" width="60" height="50" rx="14" fill={body} />
      <rect x="32" y="14" width="9" height="26" rx="3" fill={body} />
      <rect x="59" y="14" width="9" height="26" rx="3" fill={body} />
      <path
        d="M50 88 Q50 104 36 104 Q22 104 22 92"
        fill="none"
        stroke={body}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="38" cy="55" r="3.2" fill={face} />
      <path
        d="M64 49 L57 58 L62 58 L60 65 L68 56 L63.5 56 L66 49 Z"
        fill={COLORS.yellow}
      />
      <path
        d="M40 74 Q50 80 60 74"
        fill="none"
        stroke={face}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  variant = "horizontal",
  tone = "dark",
  size = 32,
  mark = false,
}: {
  className?: string;
  variant?: Variant;
  tone?: Tone;
  size?: number;
  /** Back-compat: equivalent to variant="mark" */
  mark?: boolean;
}) {
  const resolvedVariant: Variant = mark ? "mark" : variant;

  return (
    <Link
      href="/"
      aria-label="nik volt — početna"
      className={cn(
        "nw-logo group inline-flex items-center font-bold leading-none lowercase",
        resolvedVariant === "stacked" ? "flex-col" : "flex-row",
        className,
      )}
      style={{
        gap: resolvedVariant === "stacked" ? size * 0.25 : size * 0.4,
        letterSpacing: "-0.045em",
        fontSize: size * 1.25,
        color: tone === "light" ? COLORS.paper : "var(--ink)",
      }}
    >
      <span className="transition-transform duration-200 group-hover:rotate-[-6deg]">
        {tone === "dark" ? (
          <>
            <span className="dark:hidden"><Mark size={size} tone="dark" /></span>
            <span className="hidden dark:inline"><Mark size={size} tone="light" /></span>
          </>
        ) : (
          <Mark size={size} tone={tone} />
        )}
      </span>
      {resolvedVariant !== "mark" && (
        <span>
          nik
          <span
            aria-hidden
            style={{ color: COLORS.yellow, fontWeight: 400, margin: "0 0.05em" }}
          >
            ·
          </span>
          volt
        </span>
      )}
    </Link>
  );
}
