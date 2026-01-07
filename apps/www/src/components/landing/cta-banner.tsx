import { Button } from "@residence/ui/components/shadcn/button";
import { BlurFade } from "@/components/ui/blur-fade";

const ANIMATION_DELAY = 0.2;
const MAX_CONTAINER_WIDTH = "max-w-6xl";
const BANNER_HEIGHT = "h-96";

type CTABannerProps = {
  heading: string;
  description: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonUrl?: string;
};

const CTABanner = ({
  heading,
  description,
  backgroundImage = "/abstract.webp",
  buttonText,
  buttonUrl,
}: CTABannerProps) => {
  return (
    <section className="w-full px-4 py-8 md:py-12">
      <BlurFade delay={ANIMATION_DELAY}>
        <div
          className={`relative mx-auto ${MAX_CONTAINER_WIDTH} flex ${BANNER_HEIGHT} items-center justify-center overflow-hidden rounded-xl bg-center bg-cover md:rounded-3xl`}
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        >
          {/* Content */}
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-6 text-center">
            <h2 className="mb-4 font-nineties text-3xl text-white leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {heading}
            </h2>
            <p className="mb-8 max-w-2xl text-base text-white/90 sm:text-lg md:text-xl">
              {description}
            </p>
            {buttonText && buttonUrl && (
              <Button
                asChild
                className="bg-white font-mono text-black hover:bg-white/90"
                size="lg"
              >
                <a href={buttonUrl}>{buttonText}</a>
              </Button>
            )}
          </div>
        </div>
      </BlurFade>
    </section>
  );
};

export { CTABanner };
