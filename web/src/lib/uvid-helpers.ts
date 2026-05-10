export const STATUS_LABELS = {
  new: "Novo",
  reviewing: "U pregledu",
  quoted: "Ponuda data",
  scheduled: "Zakazano",
  done: "Završeno",
  spam: "Spam",
} as const;

export type SubmissionStatus = keyof typeof STATUS_LABELS;

export const URGENCY_LABELS = {
  "not-urgent": "Nije hitno",
  today: "Danas",
  urgent: "Hitno",
} as const;

export const CATEGORY_LABELS = {
  "no-power": "Nema struje",
  "fuse-trip": "Iskače osigurač",
  "new-install": "Nova instalacija",
  "short-circuit": "Kratak spoj",
  "panel-replacement": "Zamena table",
  other: "Ostalo",
} as const;

export const PROPERTY_LABELS = {
  apartment: "Stan",
  house: "Kuća",
  shop: "Lokal",
  office: "Kancelarija",
} as const;

export function statusBadgeClass(s: SubmissionStatus): string {
  switch (s) {
    case "new":
      return "bg-brand text-brand-foreground";
    case "reviewing":
      return "bg-foreground text-background";
    case "quoted":
      return "bg-accent text-accent-foreground";
    case "scheduled":
      return "bg-foreground/10 text-foreground";
    case "done":
      return "bg-muted text-foreground";
    case "spam":
      return "bg-emergency-soft text-emergency";
  }
}

export function urgencyBadgeClass(u: string): string {
  if (u === "urgent") return "bg-emergency text-emergency-foreground";
  if (u === "today") return "bg-foreground text-background";
  return "bg-muted text-foreground";
}

export function riskBadgeClass(r: string | null | undefined): string {
  if (r === "high") return "bg-emergency text-emergency-foreground";
  if (r === "medium") return "bg-brand text-brand-foreground";
  return "bg-muted text-foreground";
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("sr-Latn", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export type SubmissionRow = {
  id: string;
  created_at: string;
  status: SubmissionStatus;
  name: string;
  phone: string;
  location: string;
  property_type: keyof typeof PROPERTY_LABELS;
  category: keyof typeof CATEGORY_LABELS;
  urgency: keyof typeof URGENCY_LABELS;
  description: string | null;
  burning_smell: boolean;
  hot_panel: boolean;
  sparking: boolean;
  photo_paths: string[];
  risk_level: "low" | "medium" | "high" | null;
  risk_callout: string | null;
  admin_notes: string | null;
  estimated_price_min: number | null;
  estimated_price_max: number | null;
};
