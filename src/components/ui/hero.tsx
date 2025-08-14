import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import {
  GrabIcon,
  CarsomeIcon,
  BukalapakIcon,
  CarousellIcon,
  FinAccelIcon,
} from "@/components/icons/startups";

type MarqueeItem = {
  link: string;
  name: string;
} & (
  | { component: React.ComponentType<{ className?: string }> }
  | { image: string }
);

interface HeroProps {
  heading: string;
  description: string;
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

const Hero = ({ heading, description, buttons }: HeroProps) => {
  return (
    <section className="pt-24 sm:pt-32 md:pt-40 pb-4 relative overflow-hidden">
      <div className="container relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <BlurFade delay={0}>
            <Badge variant="outline" className="mb-4">
              For AI Builders
            </Badge>
          </BlurFade>

          <BlurFade delay={0.05}>
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-semibold mb-6 leading-tight sm:leading-tight md:leading-snug text-balance max-w-[400px] sm:max-w-none mx-auto">
              {heading}
            </h1>
          </BlurFade>

          <BlurFade delay={0.1}>
            <p className="text-muted-foreground text-lg sm:text-lg lg:text-xl mb-8 max-w-[320px] sm:max-w-2xl mx-auto">
              {description}
            </p>
          </BlurFade>

          <BlurFade delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {buttons?.primary && (
                <Button asChild size="lg" className="px-8 font-sans">
                  <a href={buttons.primary.url}>
                    {buttons.primary.text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
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

          <div className="mt-4 sm:mt-6 md:-mt-10 lg:-mt-20">
            <BlurFade delay={0.3}>
              <Marquee className="max-w-full sm:max-w-3xl md:max-w-4xl">
                {(
                  [
                    {
                      component: GrabIcon,
                      link: "http://www.grab.com/",
                      name: "Grab",
                    },
                    {
                      component: BukalapakIcon,
                      link: "http://www.bukalapak.com/",
                      name: "Bukalapak",
                    },
                    {
                      component: CarousellIcon,
                      link: "http://www.carousell.sg/",
                      name: "Carousell",
                    },
                    {
                      component: CarsomeIcon,
                      link: "http://www.carsome.my/",
                      name: "Carsome",
                    },
                    {
                      component: FinAccelIcon,
                      link: "http://finaccel.co/",
                      name: "Finaccel",
                    },
                    /*
                  { 
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2F7e26878f6ccb431692209fa86433f1c7?format=webp&width=2000", 
                    link: "http://seppure.com/", 
                    name: "Seppure"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2F544f78d88c1f4fa5bd0ce164a197c714?width=93",
                    link: "http://pandai.org/",
                    name: "Pandai"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2F411c00eb2f6348df88030862f8a4f19a?width=93",
                    link: "http://pomelofashion.com/",
                    name: "Pomelo"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2F1ead56ccef8446a483900bc843e6a91c?width=93",
                    link: "https://www.seventhsense.ai",
                    name: "Seventh Sense AI"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2F9a358147ed49408bbee2f29134f9abc3?format=webp&width=2000",
                    link: "http://aerodyne.group/",
                    name: "Aerodyne"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2F8ad325791973427fa03bde907c783d6b?width=93",
                    link: "http://www.investax.io/",
                    name: "Investax"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2Ff8614e698b2b4182895ee8b549eb53c6?format=webp&width=2000",
                    link: "http://www.alodokter.com/",
                    name: "Alodokter"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2F2ea318d1b8f24bfcab78f06336d521dc?width=93",
                    link: "http://stockbit.com/",
                    name: "Stockbit"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2F963f535e60c340fbbf84dd2e939c6352?width=93",
                    link: "http://www.homage.sg/",
                    name: "Homage"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2F385e9ad973d244adbc3b9621caea5ea2?format=webp&width=2000",
                    link: "http://www.99.co/",
                    name: "99 Group"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2F101e87d7c3eb40eabcc4b60738b76647?format=webp&width=2000",
                    link: "http://bukukas.co.id/",
                    name: "Lummo"
                  },
                  {
                    image: "https://cdn.builder.io/api/v1/image/assets%2F26187a5473654c43ab7a1b7a54514e5c%2Fcd2fe8f98ea44b2f9f2cd34007ce4db6?width=93",
                    link: "http://appboxo.com/",
                    name: "Appboxo"
                  }, */
                  ] as MarqueeItem[]
                ).map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-full w-fit mx-3 sm:mx-4 md:mx-6 lg:mx-8 flex items-center justify-start hover:opacity-80 transition-opacity"
                    aria-label={item.name}
                  >
                    {"component" in item ? (
                      <item.component className="h-8 w-auto sm:h-10 md:h-12" />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-6 w-auto sm:h-7 md:h-8 object-contain"
                        loading="lazy"
                      />
                    )}
                  </a>
                ))}
              </Marquee>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
