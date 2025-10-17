import { BlurFade } from "@/components/ui/blur-fade";
import { Lightbulb, Telescope, Sparkles } from "lucide-react";

const ANIMATION_DELAY_BASE = 0.3;
const ANIMATION_DELAY_INCREMENT = 0.1;

interface Audience {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const AUDIENCES: Audience[] = [
  {
    icon: Lightbulb,
    title: "inventors",
    description: "who want to work on hard problems.",
  },
  {
    icon: Telescope,
    title: "visionaries",
    description: "who think long term and keep an open mind.",
  },
  {
    icon: Sparkles,
    title: "creators",
    description: "who want to change the world.",
  },
];

const WhoThisIsFor = () => {
  return (
    <section className="w-full py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <BlurFade delay={ANIMATION_DELAY_BASE}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mb-12 md:mb-16">
            who this is for
          </h2>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {AUDIENCES.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <BlurFade
                key={audience.title}
                delay={
                  ANIMATION_DELAY_BASE + (index + 1) * ANIMATION_DELAY_INCREMENT
                }
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 p-4 rounded-full bg-muted">
                    <Icon className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">
                    {audience.title}
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground">
                    {audience.description}
                  </p>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { WhoThisIsFor };
