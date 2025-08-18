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
  Pomelo,
  SeventhSenseAI,
  Alodokter,
  Homage,
  NinetyNineCo,
  AppBoxo,
} from "@/components/icons/startups";
import {
  ReplyrAI,
  CleveAI,
  DocuAsk,
  ResidentImages,
  StealthStartup,
  NewellRoad,
} from "@/components/icons/residents";
import { StartupImages } from "@/components/icons/startups";

type MarqueeItem = {
  link: string;
  name: string;
} & (
  | {
      component: React.ComponentType<{
        className?: string;
        style?: React.CSSProperties;
      }>;
    }
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
                    {
                      component: Pomelo,
                      link: "https://pomelofashion.com",
                      name: "Pomelo",
                    },
                    {
                      component: SeventhSenseAI,
                      link: "https://seventhsense.ai/",
                      name: "Seventh Sense",
                    },
                    {
                      image: StartupImages.aerodyne,
                      link: "https://aerodyne.group",
                      name: "Aerodyne",
                    },
                    {
                      image: StartupImages.investax,
                      link: "https://investax.io",
                      name: "Investax",
                    },
                    {
                      component: Alodokter,
                      link: "https://alodokter.com",
                      name: "Alodokter",
                    },
                    {
                      image: StartupImages.stockbit,
                      link: "https://stockbit.com",
                      name: "Stockbit",
                    },
                    {
                      component: Homage,
                      link: "https://www.homage.com.my",
                      name: "Homage",
                    },
                    {
                      component: NinetyNineCo,
                      link: "https://www.99.co",
                      name: "99 Group",
                    },
                    {
                      component: AppBoxo,
                      link: "https://www.appboxo.com",
                      name: "Appboxo",
                    },
                  ] as MarqueeItem[]
                ).map((item, index) => {
                  // Logos that should be way bigger than everything else
                  const wayBiggerLogos = [
                    "Carsome",
                    "Pomelo",
                    "Seventh Sense AI",
                    "Aerodyne",
                  ];
                  // List of logos that should be bigger
                  const biggerLogos = ["Grab", "Carousell"];
                  // Logo that should be bigger with upward adjustment
                  const stockbitAdjust = item.name === "Stockbit";
                  // Logo that should be smaller
                  const smallerLogos = ["Alodokter"];

                  const isWayBigger = wayBiggerLogos.includes(item.name);
                  const isBigger = biggerLogos.includes(item.name);
                  const isSmaller = smallerLogos.includes(item.name);

                  let className;
                  let additionalStyle = {};

                  if (isWayBigger) {
                    // Way bigger for Carsome, Pomelo, Seventh Sense, Aerodyne
                    className =
                      "component" in item
                        ? "h-16 w-auto sm:h-20 md:h-24"
                        : "h-14 w-auto sm:h-18 md:h-20 object-contain";
                  } else if (stockbitAdjust) {
                    // Stockbit - bigger with upward adjustment
                    className = "h-10 w-auto sm:h-12 md:h-14 object-contain";
                    additionalStyle = { transform: "translateY(-4px)" };
                  } else if (isBigger) {
                    // Bigger for other logos
                    className =
                      "component" in item
                        ? "h-12 w-auto sm:h-14 md:h-16"
                        : "h-10 w-auto sm:h-12 md:h-14 object-contain";
                  } else if (isSmaller) {
                    // Smaller for Alodokter
                    className =
                      "component" in item
                        ? "h-6 w-auto sm:h-7 md:h-8"
                        : "h-5 w-auto sm:h-6 md:h-7 object-contain";
                  } else {
                    // Default size
                    className =
                      "component" in item
                        ? "h-8 w-auto sm:h-10 md:h-12"
                        : "h-6 w-auto sm:h-7 md:h-8 object-contain";
                  }

                  return (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative h-full w-fit mx-3 sm:mx-4 md:mx-6 lg:mx-8 flex items-center justify-start hover:opacity-80 transition-opacity"
                      aria-label={item.name}
                    >
                      {"component" in item ? (
                        <item.component
                          className={className}
                          style={additionalStyle}
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt={item.name}
                          className={className}
                          style={additionalStyle}
                          loading="lazy"
                        />
                      )}
                    </a>
                  );
                })}
              </Marquee>
            </BlurFade>

            {/* Technology Stack Marquee */}
            <BlurFade delay={0.35}>
              <Marquee
                direction="right"
                className="max-w-full sm:max-w-3xl md:max-w-4xl !mt-4 !sm:mt-6"
              >
                {(
                  [
                    {
                      component: ReplyrAI,
                      link: "https://replyr.ai",
                      name: "ReplyrAI",
                    },
                    {
                      component: CleveAI,
                      link: "https://cleve.ai",
                      name: "CleveAI",
                    },
                    {
                      component: DocuAsk,
                      link: "https://docuask.ai",
                      name: "DocuAsk",
                    },
                    {
                      image: ResidentImages.bluebolt,
                      link: "https://blueboltlabs.com",
                      name: "Blue Bolt Labs",
                    },
                    {
                      image: ResidentImages.easybuzz,
                      link: "https://easybuzz.ai",
                      name: "EasyBuzz",
                    },
                    {
                      component: StealthStartup,
                      link: "https://stealth-startups.com",
                      name: "Stealth Startup",
                    },
                    {
                      component: NewellRoad,
                      link: "https://newellroad.com",
                      name: "Newell Road",
                    },
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
                      <item.component className="h-6 w-auto sm:h-7 md:h-8" />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={
                          item.name === "Blue Bolt Labs" ||
                          item.name === "EasyBuzz"
                            ? "h-10 w-auto sm:h-12 md:h-14 object-contain"
                            : "h-5 w-auto sm:h-6 md:h-7 object-contain"
                        }
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
