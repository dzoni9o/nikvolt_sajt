import type { ServiceCategory, Urgency } from "./content";

export type RiskLevel = "low" | "medium" | "high";

export type RiskInput = {
  category: ServiceCategory;
  urgency: Urgency;
  burningSmell: boolean;
  hotPanel: boolean;
  sparking: boolean;
};

export type RiskAssessment = {
  level: RiskLevel;
  score: number;
  reasons: string[];
  guidance: string;
  callout: string;
};

export function assessRisk(input: RiskInput): RiskAssessment {
  let score = 0;
  const reasons: string[] = [];

  if (input.burningSmell) {
    score += 4;
    reasons.push("Prijavljen miris paljevine");
  }
  if (input.hotPanel) {
    score += 3;
    reasons.push("Tabla se greje");
  }
  if (input.sparking) {
    score += 4;
    reasons.push("Prijavljeno varničenje");
  }
  if (input.category === "short-circuit") {
    score += 2;
    reasons.push("Sumnja na kratak spoj");
  }
  if (input.category === "no-power") {
    score += 1;
  }
  if (input.urgency === "urgent") {
    score += 2;
  } else if (input.urgency === "today") {
    score += 1;
  }

  let level: RiskLevel = "low";
  if (score >= 5) level = "high";
  else if (score >= 2) level = "medium";

  const guidance =
    level === "high"
      ? "Ako osećaš miris paljevine ili vidiš dim, isključi glavni osigurač. Ne uključuj ništa drugo. Tvoj poziv ide u prioritet."
      : level === "medium"
      ? "Izbegavaj kolo na kome je problem. Izlazimo čim se oslobodi termin — gde je moguće isti dan."
      : "Javljamo se sa okvirnom cenom i prvim slobodnim terminom.";

  const callout =
    level === "high"
      ? "Preporučujemo hitan izlazak na teren."
      : level === "medium"
      ? "Zakaži izlazak isti dan, da budeš siguran."
      : "Standardno zakazivanje — najčešće u roku od 1–2 dana.";

  return { level, score, reasons, guidance, callout };
}
