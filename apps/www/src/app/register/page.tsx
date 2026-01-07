"use client";

import { Button } from "@residence/ui/components/shadcn/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatedNavigation } from "@/components/landing/navigation";
import { NuveqAppDownload } from "@/components/registration/nuveq-app-download";
import { VisitorRegistrationForm } from "@/components/registration/visitor-registration-form";
import { BGPattern } from "@/components/ui/bg-pattern";
import { BlurFade } from "@/components/ui/blur-fade";

function getPatternFill(theme: string | undefined): string {
  if (theme === "dark") {
    return "rgba(255, 255, 255, 0.15)";
  }
  if (theme === "light") {
    return "rgba(0, 0, 0, 0.12)";
  }
  return "rgba(128, 128, 128, 0.1)";
}

export default function RegisterPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center">
      <BGPattern
        className="fixed inset-0 z-0"
        fill={getPatternFill(theme)}
        mask="fade-edges"
        size={40}
        variant="grid"
      />

      <AnimatedNavigation />

      <section className="relative w-full pt-24 pb-8 sm:pt-32">
        <div className="container mx-auto px-4">
          <BlurFade delay={0}>
            <Link className="mb-6 inline-block" href="/">
              <Button className="gap-2 font-mono" size="sm" variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                back
              </Button>
            </Link>
          </BlurFade>

          <BlurFade delay={0.05}>
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <h1 className="font-nineties text-4xl sm:text-5xl md:text-6xl">
                visitor registration
              </h1>
            </div>
          </BlurFade>
        </div>
      </section>

      <section className="relative w-full pb-8">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.08}>
            <VisitorRegistrationForm />
          </BlurFade>
        </div>
      </section>

      <section className="relative w-full pb-8">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.12}>
            <div className="mx-auto max-w-md">
              <NuveqAppDownload />
            </div>
          </BlurFade>
        </div>
      </section>

      <section className="relative w-full pb-20">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.18}>
            <div className="mx-auto max-w-md text-center">
              <Link href="/guide">
                <Button className="font-mono" size="sm" variant="outline">
                  view house guide
                </Button>
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
