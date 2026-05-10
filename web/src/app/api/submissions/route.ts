import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getTranslations } from "next-intl/server";
import { serviceClient, SUBMISSIONS_BUCKET } from "@/lib/supabase/service";
import { assessRiskWith } from "@/lib/risk";
import { sendNewSubmissionEmail } from "@/lib/notify";
import { site } from "@/lib/site-config";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB each (already client-compressed)

const submissionSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z
    .string()
    .min(6)
    .max(40)
    .regex(/^[+\d][\d\s\-/]+$/),
  location: z.string().min(2).max(120),
  propertyType: z.enum(["apartment", "house", "shop", "office"]),
  category: z.enum([
    "no-power",
    "fuse-trip",
    "new-install",
    "short-circuit",
    "panel-replacement",
    "other",
  ]),
  urgency: z.enum(["not-urgent", "today", "urgent"]),
  description: z.string().max(2000).optional().nullable(),
  burningSmell: z.boolean(),
  hotPanel: z.boolean(),
  sparking: z.boolean(),
  hcaptchaToken: z.string().min(1, "Captcha required"),
});

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  // 1. Parse + validate fields
  const raw = {
    name: str(form.get("name")),
    phone: str(form.get("phone")),
    location: str(form.get("location")),
    propertyType: str(form.get("propertyType")),
    category: str(form.get("category")),
    urgency: str(form.get("urgency")),
    description: str(form.get("description")) || null,
    burningSmell: form.get("burningSmell") === "true",
    hotPanel: form.get("hotPanel") === "true",
    sparking: form.get("sparking") === "true",
    hcaptchaToken: str(form.get("hcaptchaToken")),
  };

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // 2. Verify hCaptcha
  const captchaOk = await verifyHCaptcha(data.hcaptchaToken, clientIp(req));
  if (!captchaOk) {
    return NextResponse.json({ error: "Captcha failed" }, { status: 400 });
  }

  // 3. Collect photos
  const photoEntries = form
    .getAll("photos")
    .filter((v): v is File => v instanceof File && v.size > 0);

  if (photoEntries.length > MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Najviše ${MAX_PHOTOS} fotki po prijavi` },
      { status: 400 },
    );
  }
  for (const f of photoEntries) {
    if (f.size > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: `Fotka prevelika: ${f.name}` },
        { status: 400 },
      );
    }
    if (!/^(image|video)\//.test(f.type)) {
      return NextResponse.json(
        { error: `Nedozvoljen format: ${f.name}` },
        { status: 400 },
      );
    }
  }

  // 4. Risk assessment (server-side recompute — don't trust client).
  // We always store the Serbian-localized strings in the DB so admin Uvid is
  // language-agnostic. The client gets back the structured score and renders
  // its own localized strings.
  const riskInput = {
    category: data.category as never,
    urgency: data.urgency as never,
    burningSmell: data.burningSmell,
    hotPanel: data.hotPanel,
    sparking: data.sparking,
  };
  const tReasons = await getTranslations({ locale: "sr", namespace: "Risk.reasons" });
  const tGuidance = await getTranslations({ locale: "sr", namespace: "Risk.guidance" });
  const tCallout = await getTranslations({ locale: "sr", namespace: "Risk.callout" });
  const assessment = assessRiskWith(riskInput, {
    reasons: (k) => tReasons(k),
    guidance: (k) => tGuidance(k),
    callout: (k) => tCallout(k),
  });

  // 5. Insert row first (without photos), then upload, then patch row.
  const supabase = serviceClient();

  const { data: inserted, error: insertErr } = await supabase
    .from("submissions")
    .insert({
      name: data.name,
      phone: data.phone,
      location: data.location,
      property_type: data.propertyType,
      category: data.category,
      urgency: data.urgency,
      description: data.description,
      burning_smell: data.burningSmell,
      hot_panel: data.hotPanel,
      sparking: data.sparking,
      risk_level: assessment.level,
      risk_callout: assessment.callout,
      user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
      ip_hash: hashIp(clientIp(req)),
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    console.error("[submissions] insert", insertErr);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  const submissionId = inserted.id as string;

  // 6. Upload photos
  const uploadedPaths: string[] = [];
  for (let i = 0; i < photoEntries.length; i++) {
    const file = photoEntries[i];
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const path = `${submissionId}/${i.toString().padStart(2, "0")}-${cryptoRandom()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from(SUBMISSIONS_BUCKET)
      .upload(path, buf, {
        contentType: file.type,
        upsert: false,
      });
    if (upErr) {
      console.error("[submissions] upload", upErr);
      continue; // partial upload is OK; admin will see what landed
    }
    uploadedPaths.push(path);
  }

  if (uploadedPaths.length > 0) {
    await supabase
      .from("submissions")
      .update({ photo_paths: uploadedPaths })
      .eq("id", submissionId);
  }

  // 7. Notify (email)
  try {
    await sendNewSubmissionEmail({
      id: submissionId,
      name: data.name,
      phone: data.phone,
      location: data.location,
      category: data.category,
      urgency: data.urgency,
      description: data.description,
      burningSmell: data.burningSmell,
      hotPanel: data.hotPanel,
      sparking: data.sparking,
      riskLevel: assessment.level,
      riskCallout: assessment.callout,
      photoCount: uploadedPaths.length,
      reviewUrl: `${site.url}/uvid/${submissionId}`,
    });
  } catch (err) {
    console.error("[submissions] notify", err);
    // Don't fail the request just because email failed.
  }

  return NextResponse.json({
    ok: true,
    id: submissionId,
    assessment,
  });
}

// ---------- helpers ----------

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v : "";
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    ""
  );
}

function hashIp(ip: string): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT ?? "nikvolt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 24);
}

function cryptoRandom(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function verifyHCaptcha(token: string, ip: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("[submissions] HCAPTCHA_SECRET_KEY missing — skipping verify");
    return true; // dev fallback; in prod, keep the env var set
  }
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.append("remoteip", ip);
    const res = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (err) {
    console.error("[submissions] hcaptcha", err);
    return false;
  }
}
