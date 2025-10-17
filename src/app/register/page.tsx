"use client";

import { AnimatedNavFramer } from "@/components/ui/navigation-bar-animation";
import { BGPattern } from "@/components/ui/bg-pattern";
import { VisitorRegistrationForm } from "@/components/visitor-registration-form";
import { NuveqAppDownload } from "@/components/nuveq-app-download";
import { BlurFade } from "@/components/ui/blur-fade";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center">
      {/* Background pattern for entire page */}
      <BGPattern
        variant="grid"
        mask="fade-edges"
        size={40}
        fill={
          theme === "dark"
            ? "rgba(255, 255, 255, 0.15)"
            : theme === "light"
              ? "rgba(0, 0, 0, 0.12)"
              : "rgba(128, 128, 128, 0.1)"
        }
        className="fixed inset-0 z-0"
      />

      <AnimatedNavFramer />

      {/* Header Section */}
      <section className="relative w-full pt-24 sm:pt-32 pb-8">
        <div className="container mx-auto px-4">
          <BlurFade delay={0}>
            <Link href="/" className="inline-block mb-6">
              <Button variant="ghost" size="sm" className="gap-2 font-mono">
                <ArrowLeft className="h-4 w-4" />
                back
              </Button>
            </Link>
          </BlurFade>

          <BlurFade delay={0.05}>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="font-nineties text-4xl sm:text-5xl md:text-6xl">
                visitor registration
              </h1>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="relative w-full pb-8">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.08}>
            <VisitorRegistrationForm />
          </BlurFade>
        </div>
      </section>

      {/* Nuveq App Download Section */}
      <section className="relative w-full pb-8">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.12}>
            <div className="max-w-md mx-auto">
              <NuveqAppDownload />
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Help Section */}
      <section className="relative w-full pb-20">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.18}>
            <div className="text-center max-w-md mx-auto">
              <Link href="/guide">
                <Button variant="outline" size="sm" className="font-mono">
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
