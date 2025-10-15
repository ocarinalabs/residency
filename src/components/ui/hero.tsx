import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  eyebrow?: string;
  heading: string;
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

const Hero = ({ eyebrow, heading, description, buttons }: HeroProps) => {
  return (
    <section className="pt-24 sm:pt-32 md:pt-40 pb-4 relative overflow-hidden">
      <div className="container relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {eyebrow && (
            <BlurFade delay={0}>
              <Badge variant="outline" className="mb-4">
                {eyebrow}
              </Badge>
            </BlurFade>
          )}

          <BlurFade delay={0.05}>
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-semibold mb-6 leading-tight sm:leading-tight md:leading-snug text-balance max-w-[400px] sm:max-w-none mx-auto">
              {heading}
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
                <Button asChild size="lg" className="px-8 font-sans">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons?.secondary && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="font-sans"
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
