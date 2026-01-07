"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AboutResidency } from "@/components/landing/about-residency";
import { CTABanner } from "@/components/landing/cta-banner";
import { Hero } from "@/components/landing/hero";
import { AnimatedNavigation } from "@/components/landing/navigation";
import { OurResidents } from "@/components/landing/our-residents";
import { WhatToExpect } from "@/components/landing/what-to-expect";
import { BGPattern } from "@/components/ui/bg-pattern";

function getPatternFill(theme: string | undefined): string {
  if (theme === "dark") {
    return "rgba(255, 255, 255, 0.15)";
  }
  if (theme === "light") {
    return "rgba(0, 0, 0, 0.12)";
  }
  return "rgba(128, 128, 128, 0.1)";
}

export default function Home() {
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
      <Hero
        buttons={{
          primary: { text: "lock in", url: "/register" },
        }}
        eyebrow="the 500 social house"
      />
      <AboutResidency />
      <WhatToExpect />
      <OurResidents />
      <CTABanner
        buttonText="lock in"
        buttonUrl="/register"
        description="malaysia's first ai residency. where it all starts."
        heading="join us now"
      />

      <section className="w-full border-border/50 border-t px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <h3 className="mb-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Disclaimer
          </h3>
          <div className="space-y-4 text-muted-foreground text-xs leading-relaxed">
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
