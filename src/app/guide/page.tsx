"use client";

import { AnimatedNavFramer } from "@/components/ui/navigation-bar-animation";
import { BGPattern } from "@/components/ui/bg-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GuidePage() {
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
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </BlurFade>

          <BlurFade delay={0.05}>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Office Guide
              </h1>
              <p className="text-muted-foreground text-lg">Coming soon</p>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Content Section - Empty for now */}
      <section className="relative w-full pb-20">
        <div className="container mx-auto px-4">
          {/* Content will go here */}
        </div>
      </section>
    </main>
  );
}
