import { BlurFade } from "@/components/ui/blur-fade";

const ANIMATION_DELAY = 0.3;

export function AboutResidency() {
  return (
    <section className="w-full px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-4xl">
        <BlurFade delay={ANIMATION_DELAY}>
          <div className="space-y-8">
            <h2 className="mb-8 font-nineties text-4xl sm:text-5xl md:mb-12 md:text-6xl">
              Malaysia&apos;s premier <em>AI</em> residency
            </h2>

            <p className="text-lg leading-relaxed md:text-xl">
              An experimental AI residency connecting Malaysia&apos;s{" "}
              <em>ambitious</em> and <em>innovative</em> builders.
            </p>

            <p className="text-lg leading-relaxed md:text-xl">
              Based at the 500 Social House, we offer premium co-working space
              to work with equally ambitious peers who aim to ship AI products
              that <em>matter</em>.
            </p>

            <p className="text-lg leading-relaxed md:text-xl">
              Build <em>faster</em>. Ship <em>daily</em>. Grow{" "}
              <em>exponentially</em>. Surrounded by founders and hackers who can
              push you to level up every single day.
            </p>

            <p className="text-lg leading-relaxed md:text-xl">
              Share wins, debug together, create content, and build in public
              alongside hackers and founders who aim to reshape Southeast
              Asia&apos;s tech landscape with <em>AI</em>.
            </p>

            <p className="text-lg leading-relaxed md:text-xl">
              We&apos;re looking for <em>builders</em> creating with AI,{" "}
              <em>technical founders</em> shipping real products, and{" "}
              <em>hackers</em> who move fast and ship <em>faster</em>.
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
