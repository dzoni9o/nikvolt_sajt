import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { ServiceCategory, Urgency } from "./content";

export type RiskLevel = "low" | "medium" | "high";

export type RiskInput = {
  category: ServiceCategory;
  urgency: Urgency;
  burningSmell: boolean;
  hotPanel: boolean;
  sparking: boolean;
};

export type RiskReasonKey =
  | "burning"
  | "hotPanel"
  | "sparking"
  | "shortCircuit";

export type RiskScore = {
  level: RiskLevel;
  score: number;
  reasonKeys: RiskReasonKey[];
};

export type RiskAssessment = RiskScore & {
  reasons: string[];
  guidance: string;
  callout: string;
};

export function scoreRisk(input: RiskInput): RiskScore {
  let score = 0;
  const reasonKeys: RiskReasonKey[] = [];

  if (input.burningSmell) {
    score += 4;
    reasonKeys.push("burning");
  }
  if (input.hotPanel) {
    score += 3;
    reasonKeys.push("hotPanel");
  }
  if (input.sparking) {
    score += 4;
    reasonKeys.push("sparking");
  }
  if (input.category === "short-circuit") {
    score += 2;
    reasonKeys.push("shortCircuit");
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

  return { level, score, reasonKeys };
}

type Translator = (key: string) => string;

export function decorateRisk(
  base: RiskScore,
  tReasons: Translator,
  tGuidance: Translator,
  tCallout: Translator,
): RiskAssessment {
  return {
    ...base,
    reasons: base.reasonKeys.map((k) => tReasons(k)),
    guidance: tGuidance(base.level),
    callout: tCallout(base.level),
  };
}

/**
 * Server-side: scores + decorates using the active request locale.
 * Used inside the API route — pass the next-intl translators in.
 */
export function assessRiskWith(
  input: RiskInput,
  translators: {
    reasons: Translator;
    guidance: Translator;
    callout: Translator;
  },
): RiskAssessment {
  const base = scoreRisk(input);
  return decorateRisk(
    base,
    translators.reasons,
    translators.guidance,
    translators.callout,
  );
}

/**
 * Client hook for live preview while the user is filling the form.
 */
export function useLiveRisk(input: RiskInput): RiskAssessment {
  const tReasons = useTranslations("Risk.reasons");
  const tGuidance = useTranslations("Risk.guidance");
  const tCallout = useTranslations("Risk.callout");
  return useMemo(
    () =>
      decorateRisk(
        scoreRisk(input),
        (k) => tReasons(k),
        (k) => tGuidance(k),
        (k) => tCallout(k),
      ),
    [
      input,
      tReasons,
      tGuidance,
      tCallout,
    ],
  );
}
