"use client";

import { AnimatedNavFramer } from "@/components/ui/navigation-bar-animation";
import { Hero } from "@/components/ui/hero";
import { AboutResidency } from "@/components/ui/about-residency";
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
        buttons={{
          primary: { text: "lock in", url: "/register" },
        }}
      />
      <AboutResidency />
      <WhatToExpect />
      <OurResidents />
      <CTABanner
        heading="join us now"
        description="malaysia's first ai residency. where it all starts."
        buttonText="lock in"
        buttonUrl="/register"
      />

      {/* 500 Global Disclaimer */}
      <section className="w-full py-12 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Disclaimer
          </h3>
          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              THIS WEBSITE IS PREPARED AND MAINTAINED BY FAW ALI, AND IS NOT
              MANAGED OR CONTROLLED BY 500 STARTUPS MANAGEMENT COMPANY, L.L.C.
              OR ANY OF ITS AFFILIATES (&quot;500 GLOBAL&quot;). ALL VIEWS AND
              OPINIONS REPRESENTED IN THIS WEBSITE ARE THE VIEWS AND OPINIONS OF
              FAW ALI AND DO NOT REPRESENT THOSE OF 500 GLOBAL, ANY OF ITS STAFF
              OR AFFILIATES UNLESS EXPLICITLY STATED.
            </p>
            <p>
              ALL CONTENT REPRESENTED ABOVE IS PROVIDED FOR INFORMATIONAL
              PURPOSES ONLY AND UNDER NO CIRCUMSTANCES SHOULD ANY OF THE ABOVE
              CONTENT BE CONSTRUED AS LEGAL, TAX OR INVESTMENT ADVICE OR BE
              CONSTRUED AS INVESTMENT, LEGAL OR TAX ADVICE. NO CONTENT OR
              INFORMATION IN THIS WEBSITE SHOULD BE CONSTRUED AS AN OFFER TO
              SELL OR SOLICITATION OF INTEREST TO PURCHASE ANY SECURITIES OF ANY
              OF THE COMPANIES LISTED ON THIS WEBSITE.
            </p>
            <p>
              ALL LOGOS AND TRADEMARKS OF THIRD PARTIES REFERENCED HEREIN ARE
              THE TRADEMARKS AND LOGOS OF THEIR RESPECTIVE OWNERS. ANY INCLUSION
              OF SUCH TRADEMARKS OR LOGOS DOES NOT IMPLY OR CONSTITUTE ANY
              APPROVAL, ENDORSEMENT OR SPONSORSHIP OF 500 GLOBAL BY SUCH OWNERS.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
