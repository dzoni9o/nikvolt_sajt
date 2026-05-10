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

export type EmergencyCard = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const emergencyCards: EmergencyCard[] = [
  {
    id: "fuse-trip",
    title: "Iskače osigurač",
    description: "Automatski osigurač ili FID iskače u kratkim razmacima — najčešće kratak spoj ili preopterećenje.",
    icon: ZapOff,
  },
  {
    id: "no-power",
    title: "Nestala struja",
    description: "Cela stan ili samo jedan vod — dolazimo i tražimo izvor.",
    icon: PlugZap,
  },
  {
    id: "sparking",
    title: "Varniči utičnica",
    description: "Vidljive iskre ili pucketanje — isključi je, ne uključuj ništa u nju.",
    icon: Sparkles,
  },
  {
    id: "burning-smell",
    title: "Miris paljevine",
    description: "Topljenje plastike — najčešće upozorenje pre požara.",
    icon: Flame,
  },
  {
    id: "hot-panel",
    title: "Greje se tabla",
    description: "Osigurači ili kablovi su osetno topli kada ih dodirneš.",
    icon: Thermometer,
  },
  {
    id: "shock",
    title: "Udar struje",
    description: "Osetio si strujni udar sa uređaja, prekidača ili sijalice.",
    icon: AlertTriangle,
  },
];

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  fromPrice?: string;
};

export const services: Service[] = [
  {
    id: "outlet-replacement",
    title: "Zamena utičnica",
    description: "Oštećene, klimave ili dotrajale utičnice — menjamo za par minuta.",
    icon: PlugZap,
    fromPrice: "od 1.500 RSD",
  },
  {
    id: "fuse-replacement",
    title: "Zamena osigurača",
    description: "Dotrajali automatici, neispravni FID-ovi, pogrešno dimenzionisani osigurači.",
    icon: ZapOff,
    fromPrice: "od 2.500 RSD",
  },
  {
    id: "panels",
    title: "Elektro table",
    description: "Moderna prerada table sa preglednim obeležavanjem i pravom zaštitom.",
    icon: CircuitBoard,
  },
  {
    id: "new-installation",
    title: "Nova instalacija",
    description: "Stanovi, kuće, lokali — po važećim propisima.",
    icon: Cable,
  },
  {
    id: "lighting",
    title: "Rasveta",
    description: "Lusteri, spotovi, dimeri, spoljna rasveta — uredno i izbalansirano.",
    icon: Lightbulb,
  },
  {
    id: "led",
    title: "LED sistemi",
    description: "Trake, profili, drajveri — pravilno hlađeno i komandovano.",
    icon: Sparkles,
  },
  {
    id: "smart-home",
    title: "Pametna kuća",
    description: "Shelly, Sonoff, Zigbee — bez razbijanja zidova.",
    icon: Cpu,
  },
  {
    id: "diagnostics",
    title: "Dijagnostika kvarova",
    description: "Izolacija, propuštanje, povremena iskakanja — merimo, ne pogađamo.",
    icon: Wrench,
    fromPrice: "od 2.000 RSD",
  },
  {
    id: "industrial",
    title: "Industrijske instalacije",
    description: "Trofazni razvod, motori, komandni ormani, ožičavanje mašina.",
    icon: Factory,
  },
  {
    id: "grounding",
    title: "Uzemljenje",
    description: "Provera otpora uzemljenja kalibrisanim instrumentom, sa zapisnikom.",
    icon: ShieldCheck,
  },
];

export type PriceRow = {
  label: string;
  price: string;
  note?: string;
};

export const pricing: PriceRow[] = [
  { label: "Dijagnostika", price: "od 2.000 RSD", note: "umanjuje cenu popravke" },
  { label: "Zamena utičnice", price: "od 1.500 RSD" },
  { label: "Zamena osigurača", price: "od 2.500 RSD" },
  { label: "Izlazak na teren", price: "od 3.000 RSD" },
  { label: "Prerada elektro table", price: "po proceni", note: "zavisi od broja kola i zaštite" },
  { label: "Nova instalacija po tački", price: "od 1.800 RSD" },
];

export type GalleryItem = {
  id: string;
  before: string;
  after: string;
  title: string;
  description: string;
  location?: string;
};

export const gallery: GalleryItem[] = [
  {
    id: "alu-to-cu",
    title: "Aluminijum → bakar",
    description: "Stara aluminijumska instalacija iz 70-ih zamenjena PP-Y 3×2,5 kablom uz novu zaštitu.",
    location: "Voždovac, dvosoban stan",
    before: "/gallery/alu-before.svg",
    after: "/gallery/alu-after.svg",
  },
  {
    id: "panel-rebuild",
    title: "Prerada table + FID",
    description: "Stari porcelanski osigurači zamenjeni FID/RCBO automatima, svako kolo obeleženo.",
    location: "Stari Grad, porodična kuća",
    before: "/gallery/panel-before.svg",
    after: "/gallery/panel-after.svg",
  },
  {
    id: "kitchen-rework",
    title: "Razdvojena kuhinjska kola",
    description: "Jedan preopterećen vod razdeljen na 3 zasebna kola sa pravilnom zaštitom.",
    location: "Novi Beograd, stan",
    before: "/gallery/kitchen-before.svg",
    after: "/gallery/kitchen-after.svg",
  },
];

export type Review = {
  id: string;
  author: string;
  text: string;
  rating: 5;
  source?: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    author: "Marija K.",
    text: "Poslala slike izgorele utičnice u nedelju — za 20 minuta sam dobila procenu i isti dan su izašli.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r2",
    author: "Stefan P.",
    text: "Pronašli povremeno iskakanje osigurača koje tri električara pre njih nisu mogla. Bez nepotrebnog dodavanja, prava merenja.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r3",
    author: "Ivana D.",
    text: "Tablu su uradili pregledno, svako kolo obeleženo. Ponuda i konačan račun se poklapaju do dinara.",
    rating: 5,
  },
  {
    id: "r4",
    author: "Aleksa M.",
    text: "Pametnu kuću ugradili bez razbijanja ijedne pločice. Tačno znaju koji Shelly modul ide gde.",
    rating: 5,
    source: "Google",
  },
];

export const howItWorks = [
  {
    step: "01",
    title: "Pošalji slike i kratak opis",
    description: "Slikaj tablu, utičnicu, ono što se dimi. Dva minuta na telefonu.",
  },
  {
    step: "02",
    title: "Dobijaš procenu i okvirnu cenu",
    description: "Odgovaramo šta je verovatno problem, koliko košta i kad možemo da izađemo.",
  },
  {
    step: "03",
    title: "Potvrdi i dolazimo",
    description: "Ti potvrdiš termin. Stižemo na vreme sa delovima koji odgovaraju tvom kvaru.",
  },
  {
    step: "04",
    title: "Popravljeno, izmereno, dokumentovano",
    description: "Proveravamo izolaciju i uzemljenje. Dobijaš foto-zapisnik o tome šta je urađeno.",
  },
];

export type ServiceCategory =
  | "no-power"
  | "fuse-trip"
  | "new-install"
  | "short-circuit"
  | "panel-replacement"
  | "other";

export type Urgency = "not-urgent" | "today" | "urgent";

export type PropertyType = "apartment" | "house" | "shop" | "office";

export const housePlugIcon = HousePlug;
