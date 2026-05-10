"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Phone, MessageCircle, Menu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { navigation, site } from "@/lib/site-config";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  const t = useTranslations("Nav");
  const tCta = useTranslations("Cta");
  const tBrand = useTranslations("Brand");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[backdrop-filter,background-color,border-color] duration-300",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-background/0",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <div className="flex items-center gap-8">
          <Logo size={26} />
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-muted hover:text-foreground"
              >
                {t(item.id)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher className="hidden md:inline-flex" />
          <a
            href={`tel:${site.phoneTel}`}
            className="hidden md:inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Phone className="h-4 w-4" />
            {site.phoneDisplay}
          </a>
          <a
            href={site.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
            aria-label={tCta("whatsapp")}
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <Link
            href="#assess"
            className="group hidden sm:inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm transition-all hover:bg-brand hover:text-brand-foreground hover:border-brand hover:shadow-cta hover:-translate-y-px"
          >
            {tCta("sendProblem")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Sheet>
            <SheetTrigger
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background"
              aria-label={tBrand("menuOpen")}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[88vw] max-w-sm flex-col p-6">
              <SheetHeader className="px-0">
                <SheetTitle>
                  <Logo size={28} />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navigation.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
                      >
                        {t(item.id)}
                        <ArrowRight className="h-4 w-4 text-ink-soft" />
                      </Link>
                    }
                  />
                ))}
              </nav>
              <Separator className="my-6" />
              <div className="flex flex-col gap-2">
                <SheetClose
                  render={
                    <Link
                      href="#assess"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground"
                    >
                      {tCta("sendProblem")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  }
                />
                <a
                  href={`tel:${site.phoneTel}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold"
                >
                  <Phone className="h-4 w-4" />{" "}
                  {tCta("callWithNumber", { phone: site.phoneDisplay })}
                </a>
                <a
                  href={site.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold"
                >
                  <MessageCircle className="h-4 w-4" /> {tCta("whatsapp")}
                </a>
                <LocaleSwitcher className="mt-2 self-start" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
