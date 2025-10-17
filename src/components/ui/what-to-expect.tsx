import { BlurFade } from "@/components/ui/blur-fade";

const ANIMATION_DELAY = 0.3;

const WhatToExpect = () => {
  return (
    <section className="w-full py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <BlurFade delay={ANIMATION_DELAY}>
          <div className="space-y-8">
            <h2 className="font-nineties text-4xl sm:text-5xl md:text-6xl mb-8 md:mb-12">
              what to <em>expect</em>
            </h2>

            <p className="text-lg md:text-xl leading-relaxed">
              use demo day to prove your skills to potential collaborators,
              employees, builders and others.
            </p>

            <p className="text-lg md:text-xl leading-relaxed">
              learn and grow alongside fellow residents - sharing knowledge,
              solving problems together, and pushing each other forward.
            </p>

            <p className="text-lg md:text-xl leading-relaxed">
              connect with people who will 10x your trajectory through intros
              and real conversations - no formal programs, just builders helping
              builders.
            </p>

            <p className="text-lg md:text-xl leading-relaxed">
              expect spontaneous conversations and collaborations with your
              fellow residents.
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
};

export { WhatToExpect };
