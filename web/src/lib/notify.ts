import "server-only";
import { Resend } from "resend";

type NotifyPayload = {
  id: string;
  name: string;
  phone: string;
  location: string;
  category: string;
  urgency: string;
  description?: string | null;
  burningSmell: boolean;
  hotPanel: boolean;
  sparking: boolean;
  riskLevel?: "low" | "medium" | "high" | null;
  riskCallout?: string | null;
  photoCount: number;
  reviewUrl: string;
};

const FROM = process.env.RESEND_FROM ?? "nik volt <notifications@nikvolt.com>";
const TO = process.env.NOTIFY_TO ?? "kontakt@nikvolt.com";

export async function sendNewSubmissionEmail(p: NotifyPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[notify] RESEND_API_KEY missing — skipping email");
    return;
  }
  const resend = new Resend(apiKey);

  const tagsHtml = [
    p.burningSmell && "🔥 Miris paljevine",
    p.hotPanel && "♨️ Topla tabla",
    p.sparking && "⚡ Varničenje",
  ]
    .filter(Boolean)
    .map((t) => `<li>${t}</li>`)
    .join("");

  const subject =
    p.urgency === "urgent" || p.burningSmell || p.sparking
      ? `🚨 HITNO — ${p.name} (${p.location})`
      : `Nova prijava — ${p.name} (${p.location})`;

  const html = `
    <div style="font-family:-apple-system,Segoe UI,system-ui,sans-serif;max-width:560px;color:#0A0A0A">
      <h2 style="margin:0 0 8px;font-size:18px">${escapeHtml(subject)}</h2>
      <p style="color:#666;margin:0 0 16px;font-size:13px">
        ID: <code>${p.id}</code> · ${p.photoCount} ${p.photoCount === 1 ? "fotka" : "fotke"}
      </p>

      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tbody>
          <tr><td style="padding:6px 0;color:#666;width:130px">Ime</td><td><strong>${escapeHtml(p.name)}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666">Telefon</td><td><a href="tel:${escapeHtml(p.phone)}">${escapeHtml(p.phone)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#666">Lokacija</td><td>${escapeHtml(p.location)}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Kategorija</td><td>${escapeHtml(p.category)}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Hitnost</td><td>${escapeHtml(p.urgency)}</td></tr>
          ${p.riskLevel ? `<tr><td style="padding:6px 0;color:#666">Rizik</td><td>${escapeHtml(p.riskLevel)}${p.riskCallout ? ` — ${escapeHtml(p.riskCallout)}` : ""}</td></tr>` : ""}
        </tbody>
      </table>

      ${tagsHtml ? `<div style="margin-top:14px"><strong>Crveni flagovi:</strong><ul style="margin:6px 0">${tagsHtml}</ul></div>` : ""}

      ${p.description ? `<div style="margin-top:14px;padding:12px;background:#FAFAF7;border-left:3px solid #FFD60A;border-radius:6px"><div style="color:#666;font-size:12px;margin-bottom:4px">Opis</div>${escapeHtml(p.description).replace(/\n/g, "<br/>")}</div>` : ""}

      <a href="${p.reviewUrl}" style="display:inline-block;margin-top:18px;padding:10px 18px;background:#0A0A0A;color:#fff;border-radius:999px;text-decoration:none;font-weight:600">Otvori u /uvid →</a>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject,
    html,
  });

  if (error) {
    console.error("[notify] resend error", error);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
