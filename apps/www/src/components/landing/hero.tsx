import { Button } from "@residence/ui/components/shadcn/button";
import { Logo } from "@/components/logo";
import { BlurFade } from "@/components/ui/blur-fade";

const HERO_DELAYS = {
  EYEBROW: 0,
  TITLE: 0.05,
  DESCRIPTION: 0.1,
  BUTTONS: 0.15,
} as const;

type HeroProps = {
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
};

export function Hero({ eyebrow, description, buttons }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-24 pb-4 sm:pt-32 md:pt-40">
      <div className="container relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {eyebrow && (
            <BlurFade delay={HERO_DELAYS.EYEBROW}>
              <div className="mb-6 flex inline-flex items-center gap-2 rounded-full border border-current px-6 py-2 font-nineties text-lg">
                <span>Powered by The</span>
                <Logo className="inline-block h-4 w-auto" />
                <span>Global Social House</span>
              </div>
            </BlurFade>
          )}

          <BlurFade delay={HERO_DELAYS.TITLE}>
            <h1 className="mx-auto mb-6 max-w-[400px] text-balance font-instrument text-5xl leading-tight sm:max-w-none sm:text-6xl sm:leading-tight md:text-7xl md:leading-snug lg:text-8xl xl:text-9xl">
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
            <BlurFade delay={HERO_DELAYS.DESCRIPTION}>
              <p className="mx-auto mb-8 max-w-[320px] text-lg text-muted-foreground sm:max-w-2xl sm:text-lg lg:text-xl">
                {description}
              </p>
            </BlurFade>
          )}

          <BlurFade delay={HERO_DELAYS.BUTTONS}>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              {buttons?.primary && (
                <Button asChild className="px-8 font-mono" size="lg">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons?.secondary && (
                <Button
                  asChild
                  className="font-mono"
                  size="lg"
                  variant="outline"
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
}
