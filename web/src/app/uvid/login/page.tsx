import { LoginForm } from "./login-form";

export const metadata = {
  title: "Uvid — Prijava",
  robots: { index: false, follow: false, nocache: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next ?? "/uvid";
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center">
      <h1 className="font-display text-2xl font-bold tracking-tight">Prijava u uvid</h1>
      <p className="mt-2 text-sm text-ink-soft">Pristup samo za administratora.</p>
      <LoginForm next={next} />
    </div>
  );
}
