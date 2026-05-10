"use client";

import { useMemo, useRef, useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import {
  Upload,
  X,
  AlertTriangle,
  ShieldCheck,
  Send,
  Loader2,
  Phone,
  CheckCircle2,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assessRisk, type RiskAssessment } from "@/lib/risk";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Reci nam svoje ime"),
  phone: z
    .string()
    .min(6, "Broj telefona je prekratak")
    .regex(/^[+\d][\d\s\-/]+$/, "Samo brojevi, razmaci i +"),
  location: z.string().min(2, "Grad ili kvart"),
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
  description: z.string().max(2000).optional(),
  burningSmell: z.boolean(),
  hotPanel: z.boolean(),
  sparking: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type LocalFile = {
  id: string;
  file: File;
  url: string;
  kind: "image" | "video";
};

const categoryLabels: Record<FormValues["category"], string> = {
  "no-power": "Nema struje",
  "fuse-trip": "Iskače osigurač",
  "new-install": "Nova instalacija",
  "short-circuit": "Kratak spoj",
  "panel-replacement": "Zamena table",
  other: "Ostalo",
};

export function FaultAssessmentForm() {
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RiskAssessment | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      propertyType: "apartment",
      category: "fuse-trip",
      urgency: "today",
      description: "",
      burningSmell: false,
      hotPanel: false,
      sparking: false,
    },
  });

  const watched = form.watch();
  const livePreview = useMemo(
    () =>
      assessRisk({
        category: watched.category,
        urgency: watched.urgency,
        burningSmell: watched.burningSmell,
        hotPanel: watched.hotPanel,
        sparking: watched.sparking,
      }),
    [
      watched.category,
      watched.urgency,
      watched.burningSmell,
      watched.hotPanel,
      watched.sparking,
    ],
  );

  async function handleFiles(list: FileList | null) {
    if (!list) return;
    const next: LocalFile[] = [];
    for (const file of Array.from(list)) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) continue;
      try {
        let prepared = file;
        if (isImage) {
          prepared = await imageCompression(file, {
            maxSizeMB: 1.2,
            maxWidthOrHeight: 1800,
            useWebWorker: true,
          });
        }
        if (prepared.size > 25 * 1024 * 1024) {
          toast.error(`${file.name} je veći od 25 MB — pošalji kraći snimak.`);
          continue;
        }
        next.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          file: prepared,
          url: URL.createObjectURL(prepared),
          kind: isImage ? "image" : "video",
        });
      } catch (err) {
        console.error(err);
        toast.error(`Ne mogu da pročitam ${file.name}`);
      }
    }
    setFiles((prev) => [...prev, ...next].slice(0, 8));
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const assessment = assessRisk(values);

      // Stubbed submit — wire to /api/leads when backend is live.
      console.info("[lead] submission", {
        ...values,
        attachments: files.map((f) => ({
          name: f.file.name,
          size: f.file.size,
          type: f.file.type,
        })),
        assessment,
      });
      await new Promise((r) => setTimeout(r, 900));

      setResult(assessment);
      toast.success("Poslato — javljamo se u roku od 30 minuta.", {
        description:
          assessment.level === "high"
            ? "Zahtev sa visokim rizikom — odmah te zovemo nazad."
            : "Proveri telefon za naš odgovor.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Slanje nije uspelo. Probaj ponovo ili nas direktno pozovi.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    files.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
    setResult(null);
    form.reset();
  }

  return (
    <section id="assess" className="relative isolate scroll-mt-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 500px at 80% 0%, oklch(0.78 0.17 75 / 0.18), transparent 60%), radial-gradient(700px 400px at 0% 100%, oklch(0.62 0.22 28 / 0.12), transparent 60%)",
        }}
      />
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="lg:pr-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Procena</p>
            <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
              Pošalji problem.
              <br />
              Dobij okvirnu cenu u roku od sat vremena.
            </h2>
            <p className="mt-5 max-w-md text-md text-ink-soft">
              Slike vrede više od opisa. Slikaj tablu, utičnicu, sve što se dimi — mi ćemo sve ostalo.
            </p>

            <ul className="mt-8 space-y-4">
              <RailItem
                icon={ShieldCheck}
                title="Bez iznenađenja u ponudi"
                body="Okvirna cena pre dolaska. Konačna cena nakon što vidimo instalaciju."
              />
              <RailItem
                icon={AlertTriangle}
                title="Hitni slučajevi imaju prioritet"
                body="Ako simptomi ukazuju na opasnost od požara, automatski menjamo redosled."
              />
              <RailItem
                icon={CheckCircle2}
                title="Dokumentovan rad"
                body="Svaki izlazak završavamo merenjima i fotografijama onoga što je urađeno."
              />
            </ul>

            <div className="mt-10 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Procena rizika uživo</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">{livePreview.callout}</div>
                </div>
                <RiskPill level={livePreview.level} />
              </div>
              <p className="mt-3 text-sm text-ink-soft">{livePreview.guidance}</p>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand/30 via-transparent to-emergency/15 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
              {result ? (
                <SuccessPanel result={result} onReset={reset} />
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 sm:p-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Tvoje ime" error={form.formState.errors.name?.message}>
                      <Input placeholder="Marko" {...form.register("name")} />
                    </Field>
                    <Field label="Telefon" error={form.formState.errors.phone?.message}>
                      <Input placeholder="+381 60 ..." inputMode="tel" {...form.register("phone")} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Lokacija" hint="Grad / kvart" error={form.formState.errors.location?.message}>
                      <Input placeholder={`${site.city}, Vračar`} {...form.register("location")} />
                    </Field>
                    <Field label="Tip objekta">
                      <Controller
                        name="propertyType"
                        control={form.control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartment">Stan</SelectItem>
                              <SelectItem value="house">Kuća</SelectItem>
                              <SelectItem value="shop">Lokal</SelectItem>
                              <SelectItem value="office">Kancelarija</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>
                  </div>

                  <Field label="U čemu je problem?">
                    <Controller
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((key) => (
                            <button
                              type="button"
                              key={key}
                              onClick={() => field.onChange(key)}
                              className={cn(
                                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                                field.value === key
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border bg-background text-foreground hover:bg-muted",
                              )}
                            >
                              {categoryLabels[key]}
                            </button>
                          ))}
                        </div>
                      )}
                    />
                  </Field>

                  <Field label="Koliko je hitno?">
                    <Controller
                      name="urgency"
                      control={form.control}
                      render={({ field }) => (
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { v: "not-urgent", label: "Nije hitno", hint: "1–2 dana" },
                            { v: "today", label: "Danas", hint: "isti dan" },
                            { v: "urgent", label: "Hitno", hint: "u roku od sat" },
                          ].map((opt) => (
                            <button
                              type="button"
                              key={opt.v}
                              onClick={() => field.onChange(opt.v)}
                              className={cn(
                                "rounded-xl border px-3 py-2.5 text-left transition-colors",
                                field.value === opt.v
                                  ? opt.v === "urgent"
                                    ? "border-emergency bg-emergency text-emergency-foreground"
                                    : "border-foreground bg-foreground text-background"
                                  : "border-border bg-background hover:bg-muted",
                              )}
                            >
                              <div className="text-sm font-semibold">{opt.label}</div>
                              <div className={cn("text-[11px]", field.value === opt.v ? "opacity-80" : "text-ink-soft")}>{opt.hint}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    />
                  </Field>

                  <Field label="Slike i video" hint="do 8 fajlova, kompresija u pregledaču">
                    <div
                      className={cn(
                        "rounded-xl border border-dashed border-border bg-paper/60 p-4 transition-colors",
                        files.length === 0 && "hover:border-foreground/40",
                      )}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleFiles(e.dataTransfer.files);
                      }}
                    >
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="sr-only"
                        onChange={(e) => handleFiles(e.target.files)}
                      />
                      {files.length === 0 ? (
                        <button
                          type="button"
                          onClick={() => inputRef.current?.click()}
                          className="flex w-full flex-col items-center justify-center gap-2 py-6 text-sm text-ink-soft"
                        >
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground">
                            <Upload className="h-4 w-4" />
                          </span>
                          <span><span className="font-semibold text-foreground">Dodirni za upload</span> ili prevuci ovde</span>
                          <span className="text-xs">JPG, HEIC, MP4 do 25 MB</span>
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {files.map((f) => (
                              <FilePreview key={f.id} file={f} onRemove={() => removeFile(f.id)} />
                            ))}
                            {files.length < 8 && (
                              <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-background text-ink-soft hover:bg-muted"
                              >
                                <Upload className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-ink-soft">
                            <span>{files.length} file{files.length === 1 ? "" : "s"}</span>
                            <button type="button" onClick={() => { files.forEach((f) => URL.revokeObjectURL(f.url)); setFiles([]); }} className="font-semibold text-foreground hover:underline">Clear all</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Field>

                  <Field label="Anything we should know?">
                    <Textarea rows={3} placeholder="When did it start, what changed in the apartment, anything you've already tried..." {...form.register("description")} />
                  </Field>

                  <div>
                    <Label className="mb-2 block text-sm font-semibold">Symptoms (helps us prioritize)</Label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <SymptomToggle name="burningSmell" label="Burning smell" control={form.control} />
                      <SymptomToggle name="hotPanel" label="Panel overheating" control={form.control} />
                      <SymptomToggle name="sparking" label="Sparking" control={form.control} />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse items-stretch gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <a
                      href={`tel:${site.phoneTel}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      <Phone className="h-4 w-4" /> Or call {site.phoneDisplay}
                    </a>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-cta transition-all hover:-translate-y-0.5 disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Sending
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Send request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RailItem({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-foreground text-background">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-sm text-ink-soft">{body}</div>
      </div>
    </li>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <Label className="text-sm font-semibold text-foreground">{label}</Label>
        {hint && !error && <span className="text-xs text-ink-soft">{hint}</span>}
        {error && <span className="text-xs font-medium text-emergency">{error}</span>}
      </div>
      {children}
    </div>
  );
}

function SymptomToggle({
  name,
  label,
  control,
}: {
  name: "burningSmell" | "hotPanel" | "sparking";
  label: string;
  control: Control<FormValues>;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-xl border bg-background px-3 py-3 transition-colors",
            field.value
              ? "border-emergency/50 bg-emergency-soft"
              : "border-border hover:bg-muted",
          )}
        >
          <Checkbox
            checked={!!field.value}
            onCheckedChange={(c) => field.onChange(c === true)}
            className={cn(
              field.value && "data-[state=checked]:bg-emergency data-[state=checked]:border-emergency",
            )}
          />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </label>
      )}
    />
  );
}

function FilePreview({ file, onRemove }: { file: LocalFile; onRemove: () => void }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
      {file.kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={file.url} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink-soft">
          <Video className="h-5 w-5" />
          <span className="line-clamp-1 px-2 text-[10px]">{file.file.name}</span>
        </div>
      )}
      <span className="absolute left-1.5 top-1.5 rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur">
        {file.kind === "image" ? <ImageIcon className="inline h-3 w-3" /> : <Video className="inline h-3 w-3" />}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-background/85 text-foreground opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
        aria-label="Remove file"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function RiskPill({ level }: { level: RiskAssessment["level"] }) {
  const cls =
    level === "high"
      ? "bg-emergency text-emergency-foreground"
      : level === "medium"
      ? "bg-brand text-brand-foreground"
      : "bg-muted text-foreground";
  const label = level === "high" ? "High" : level === "medium" ? "Medium" : "Low";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", cls)}>
      {label} risk
    </span>
  );
}

function SuccessPanel({ result, onReset }: { result: RiskAssessment; onReset: () => void }) {
  return (
    <div className="space-y-6 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Sent
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{result.callout}</h3>
        </div>
        <RiskPill level={result.level} />
      </div>

      <p className="text-sm text-ink-soft">{result.guidance}</p>

      {result.reasons.length > 0 && (
        <div className="rounded-2xl border border-border bg-paper p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Why this rating</div>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground">
            {result.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2">
                <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", result.level === "high" ? "bg-emergency" : "bg-foreground")} />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl bg-foreground p-5 text-background">
        <div className="text-xs font-semibold uppercase tracking-widest text-background/60">What happens next</div>
        <ol className="mt-3 space-y-2 text-sm">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" /> We review your photos within 30 minutes.</li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" /> You get an indicative price + earliest visit slot.</li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" /> Confirm and we&apos;re on the way.</li>
        </ol>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onReset} className="text-sm font-semibold text-ink-soft hover:text-foreground">Send another</button>
        <a
          href={`tel:${site.phoneTel}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emergency px-5 py-3 text-sm font-semibold text-emergency-foreground"
        >
          <Phone className="h-4 w-4" /> Call us now
        </a>
      </div>
    </div>
  );
}
