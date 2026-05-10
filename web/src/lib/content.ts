import {
  AlertTriangle,
  Flame,
  PlugZap,
  Sparkles,
  Thermometer,
  ZapOff,
  Lightbulb,
  Cable,
  Cpu,
  HousePlug,
  Wrench,
  ShieldCheck,
  Factory,
  CircuitBoard,
  type LucideIcon,
} from "lucide-react";

export type EmergencyId =
  | "fuse-trip"
  | "no-power"
  | "sparking"
  | "burning-smell"
  | "hot-panel"
  | "shock";

export const emergencyCardsConfig: { id: EmergencyId; icon: LucideIcon }[] = [
  { id: "fuse-trip", icon: ZapOff },
  { id: "no-power", icon: PlugZap },
  { id: "sparking", icon: Sparkles },
  { id: "burning-smell", icon: Flame },
  { id: "hot-panel", icon: Thermometer },
  { id: "shock", icon: AlertTriangle },
];

export type ServiceId =
  | "outlet-replacement"
  | "fuse-replacement"
  | "panels"
  | "new-installation"
  | "lighting"
  | "led"
  | "smart-home"
  | "diagnostics"
  | "industrial"
  | "grounding";

export const servicesConfig: {
  id: ServiceId;
  icon: LucideIcon;
  fromAmount?: number;
}[] = [
  { id: "outlet-replacement", icon: PlugZap, fromAmount: 1500 },
  { id: "fuse-replacement", icon: ZapOff, fromAmount: 2500 },
  { id: "panels", icon: CircuitBoard },
  { id: "new-installation", icon: Cable },
  { id: "lighting", icon: Lightbulb },
  { id: "led", icon: Sparkles },
  { id: "smart-home", icon: Cpu },
  { id: "diagnostics", icon: Wrench, fromAmount: 2000 },
  { id: "industrial", icon: Factory },
  { id: "grounding", icon: ShieldCheck },
];

export type PricingRowId =
  | "diagnostika"
  | "outlet"
  | "fuse"
  | "callout"
  | "panel"
  | "newPoint";

export const pricingRowIds: PricingRowId[] = [
  "diagnostika",
  "outlet",
  "fuse",
  "callout",
  "panel",
  "newPoint",
];

export type GalleryItemId = "alu-to-cu" | "panel-rebuild" | "kitchen-rework";

export const galleryConfig: {
  id: GalleryItemId;
  before: string;
  after: string;
}[] = [
  {
    id: "alu-to-cu",
    before: "/gallery/alu-before.svg",
    after: "/gallery/alu-after.svg",
  },
  {
    id: "panel-rebuild",
    before: "/gallery/panel-before.svg",
    after: "/gallery/panel-after.svg",
  },
  {
    id: "kitchen-rework",
    before: "/gallery/kitchen-before.svg",
    after: "/gallery/kitchen-after.svg",
  },
];

export type ReviewId = "r1" | "r2" | "r3" | "r4";

export const reviewsConfig: { id: ReviewId; author: string; source?: string }[] = [
  { id: "r1", author: "Marija K.", source: "Google" },
  { id: "r2", author: "Stefan P.", source: "Google" },
  { id: "r3", author: "Ivana D." },
  { id: "r4", author: "Aleksa M.", source: "Google" },
];

export const howItWorksSteps = ["01", "02", "03", "04"] as const;
export type StepId = (typeof howItWorksSteps)[number];

export type ServiceCategory =
  | "no-power"
  | "fuse-trip"
  | "new-install"
  | "short-circuit"
  | "panel-replacement"
  | "other";

export const serviceCategories: ServiceCategory[] = [
  "no-power",
  "fuse-trip",
  "new-install",
  "short-circuit",
  "panel-replacement",
  "other",
];

export type Urgency = "not-urgent" | "today" | "urgent";

export const urgencies: Urgency[] = ["not-urgent", "today", "urgent"];

export type PropertyType = "apartment" | "house" | "shop" | "office";

export const propertyTypes: PropertyType[] = [
  "apartment",
  "house",
  "shop",
  "office",
];

export const housePlugIcon = HousePlug;
