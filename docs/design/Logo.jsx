// Nick Wolt — React logo component (winking-plug mascot version).
// Drop into any React/Next.js project. Self-contained; no external deps.
//
// Usage:
//   <Logo size={32} />                       // horizontal lockup
//   <Logo size={48} variant="stacked" />     // icon over wordmark
//   <Logo size={40} variant="mark" />        // plug face only
//   <Logo size={28} tone="light" />          // for dark backgrounds

import React from "react";

const COLORS = {
  ink:    "#0A0A0A",
  paper:  "#FFFFFF",
  yellow: "#FFD60A",
};

function Mark({ size = 40, tone = "dark" }) {
  // tone="dark" → black plug + white face features (use on light bg)
  // tone="light" → white plug + dark face features (use on dark bg)
  const body = tone === "light" ? COLORS.paper : COLORS.ink;
  const face = tone === "light" ? COLORS.ink : COLORS.paper;
  return (
    <svg
      viewBox="0 0 100 110"
      width={size}
      height={size * 1.1}
      role="img"
      aria-label="Nick Wolt"
      style={{ flexShrink: 0 }}
    >
      <rect x="20" y="38" width="60" height="50" rx="14" fill={body} />
      <rect x="32" y="14" width="9"  height="26" rx="3"  fill={body} />
      <rect x="59" y="14" width="9"  height="26" rx="3"  fill={body} />
      <path
        d="M50 88 Q50 104 36 104 Q22 104 22 92"
        fill="none"
        stroke={body}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Dot eye (left) */}
      <circle cx="38" cy="55" r="3.2" fill={face} />
      {/* Bolt eye (right) — always brand yellow */}
      <path
        d="M64 49 L57 58 L62 58 L60 65 L68 56 L63.5 56 L66 49 Z"
        fill={COLORS.yellow}
      />
      {/* Confident smirk */}
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

export default function Logo({
  size = 40,
  variant = "horizontal", // "horizontal" | "stacked" | "mark"
  tone = "dark",          // "dark" (on light bg) | "light" (on dark bg)
  className,
  style,
}) {
  const ink = tone === "light" ? COLORS.paper : COLORS.ink;
  const fontFamily =
    '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

  if (variant === "mark") {
    return <Mark size={size} tone={tone} />;
  }

  const isStacked = variant === "stacked";
  const wordSize = size * 1.25;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: isStacked ? "column" : "row",
        alignItems: "center",
        gap: isStacked ? size * 0.25 : size * 0.4,
        fontFamily,
        fontWeight: 700,
        fontSize: wordSize,
        lineHeight: 1,
        letterSpacing: "-0.045em",
        color: ink,
        ...style,
      }}
    >
      <Mark size={size} tone={tone} />
      <span>
        nick
        <span style={{ color: COLORS.yellow, fontWeight: 400, margin: "0 0.05em" }}>
          ·
        </span>
        wolt
      </span>
    </span>
  );
}
