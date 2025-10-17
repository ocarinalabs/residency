import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { Logo } from "@/components/logo";

interface HeroProps {
  eyebrow?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
}

const Hero = ({ eyebrow, description, buttons }: HeroProps) => {
  return (
    <section className="pt-24 sm:pt-32 md:pt-40 pb-4 relative overflow-hidden">
      <div className="container relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {eyebrow && (
            <BlurFade delay={0}>
              <div className="mb-6 font-nineties text-lg px-6 py-2 flex items-center gap-2 border border-current rounded-full inline-flex">
                <span>the</span>
                <Logo className="h-4 w-auto inline-block" />
                <span>social house</span>
              </div>
            </BlurFade>
          )}

          <BlurFade delay={0.05}>
            <h1 className="font-instrument text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-6 leading-tight sm:leading-tight md:leading-snug text-balance max-w-[400px] sm:max-w-none mx-auto">
              <span className="block">
                Ship <em className="font-normal italic">daily</em>.
              </span>
              <span className="block">
                Scale <em className="font-normal italic">infinitely</em>.
              </span>
              <span className="block">
                At the <em className="font-normal italic">residency</em>.
              </span>
            </h1>
          </BlurFade>

          {description && (
            <BlurFade delay={0.1}>
              <p className="text-muted-foreground text-lg sm:text-lg lg:text-xl mb-8 max-w-[320px] sm:max-w-2xl mx-auto">
                {description}
              </p>
            </BlurFade>
          )}

          <BlurFade delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {buttons?.primary && (
                <Button asChild size="lg" className="px-8 font-mono">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons?.secondary && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="font-mono"
                >
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                </Button>
              )}
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
};

export { Hero };
