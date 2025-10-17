import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";

const ANIMATION_DELAY = 0.2;
const OVERLAY_OPACITY = 90;
const MAX_CONTAINER_WIDTH = "max-w-6xl";
const BANNER_HEIGHT = "h-96";

interface CTABannerProps {
  heading: string;
  description: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonUrl?: string;
}

const CTABanner = ({
  heading,
  description,
  backgroundImage = "/abstract.webp",
  buttonText,
  buttonUrl,
}: CTABannerProps) => {
  return (
    <section className="w-full py-8 md:py-12 px-4">
      <BlurFade delay={ANIMATION_DELAY}>
        <div
          className={`relative mx-auto ${MAX_CONTAINER_WIDTH} flex ${BANNER_HEIGHT} items-center justify-center rounded-xl md:rounded-3xl overflow-hidden`}
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          {/* Overlay ensures sufficient contrast for white text on varied backgrounds */}
          <div className={`absolute inset-0 bg-black/${OVERLAY_OPACITY}`} />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto">
            <h2 className="font-nineties text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight">
              {heading}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mb-8">
              {description}
            </p>
            {buttonText && buttonUrl && (
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-mono"
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
