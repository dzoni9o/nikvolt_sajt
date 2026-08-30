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
