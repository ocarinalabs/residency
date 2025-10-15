"use client";

import { AnimatedNavFramer } from "@/components/ui/navigation-bar-animation";
import { Hero } from "@/components/ui/hero";
import { OurResidents } from "@/components/ui/our-residents";
import { WhatToExpect } from "@/components/ui/what-to-expect";
import { CTABanner } from "@/components/ui/cta-banner";
import { BGPattern } from "@/components/ui/bg-pattern";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
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
      <Hero
        eyebrow="the 500 social house"
        heading="build and ship with ai builders"
        buttons={{
          primary: { text: "lock in", url: "/register" },
        }}
      />
      <OurResidents />
      <WhatToExpect />
      <CTABanner
        heading="join us now"
        description="malaysia's first ai residency. where it all starts."
        buttonText="lock in"
        buttonUrl="/register"
      />
    </main>
  );
}
