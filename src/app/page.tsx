"use client";

import { AnimatedNavFramer } from "@/components/ui/navigation-bar-animation";
import { Hero } from "@/components/ui/hero";
import { BGPattern } from "@/components/ui/bg-pattern";
import { VisitorRegistrationForm } from "@/components/visitor-registration-form";
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
          theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"
        }
        className="fixed inset-0"
      />
      <AnimatedNavFramer />
      <Hero
        heading="AI Residency Registration"
        description="In the 500 Social House"
        buttons={{
          primary: { text: "Register Below", url: "#register" },
        }}
      />

      {/* Visitor Registration Form */}
      <section id="register" className="relative py-20 w-full">
        <div className="container mx-auto px-4">
          <VisitorRegistrationForm />
        </div>
      </section>
    </main>
  );
}
