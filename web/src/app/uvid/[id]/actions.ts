"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "reviewing", "quoted", "scheduled", "done", "spam"]).optional(),
  admin_notes: z.string().max(4000).optional().nullable(),
  estimated_price_min: z
    .union([z.number().int().nonnegative(), z.literal("").transform(() => null), z.null()])
    .optional()
    .nullable(),
  estimated_price_max: z
    .union([z.number().int().nonnegative(), z.literal("").transform(() => null), z.null()])
    .optional()
    .nullable(),
});

export async function updateSubmission(formData: FormData): Promise<void> {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const raw = {
    id: String(formData.get("id") ?? ""),
    status: (formData.get("status") as string) || undefined,
    admin_notes: formData.has("admin_notes") ? String(formData.get("admin_notes")) : undefined,
    estimated_price_min: parseNum(formData.get("estimated_price_min")),
    estimated_price_max: parseNum(formData.get("estimated_price_max")),
  };

  const parsed = updateSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const { id, ...patch } = parsed.data;
  const { error } = await supabase.from("submissions").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/uvid/${id}`);
  revalidatePath("/uvid");
}

function parseNum(v: FormDataEntryValue | null): number | null {
  if (v === null || v === "") return null;
  const n = Number(String(v).replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}
