import { BlurFade } from "@/components/ui/blur-fade";

const ANIMATION_DELAY = 0.3;

export function WhatToExpect() {
  return (
    <section className="w-full px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-4xl">
        <BlurFade delay={ANIMATION_DELAY}>
          <div className="space-y-8">
            <h2 className="mb-8 font-nineties text-4xl sm:text-5xl md:mb-12 md:text-6xl">
              what to <em>expect</em>
            </h2>

            <p className="text-lg leading-relaxed md:text-xl">
              ability to showcase your skills to potential collaborators,
              employees, builders and others.
            </p>

            <p className="text-lg leading-relaxed md:text-xl">
              learn and grow alongside fellow residents - sharing knowledge,
              solving problems together, and pushing each other forward.
            </p>

            <p className="text-lg leading-relaxed md:text-xl">
              connect with people who can help propel your trajectory through
              intros and real conversations - no formal programs, just builders
              helping builders.
            </p>

            <p className="text-lg leading-relaxed md:text-xl">
              expect spontaneous conversations and collaborations with your
              fellow residents.
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
