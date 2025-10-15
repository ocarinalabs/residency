import { BlurFade } from "@/components/ui/blur-fade";
import {
  ReplyrAI,
  CleveAI,
  DocuAsk,
  ResidentImages,
  StealthStartup,
  NewellRoad,
  Robin,
} from "@/components/icons/residents";

const ANIMATION_DELAY = 0.3;
const GRID_COLS_MOBILE = "grid-cols-2";
const GRID_COLS_TABLET = "md:grid-cols-3";
const GRID_COLS_DESKTOP = "lg:grid-cols-4";

interface Resident {
  name: string;
  link: string;
  component?: React.ComponentType<{ className?: string }>;
  image?: string;
}

const RESIDENTS: Resident[] = [
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
    component: Robin,
    link: "https://robinbiz.com",
    name: "Robin",
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
];

const OurResidents = () => {
  return (
    <section className="w-full py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <BlurFade delay={ANIMATION_DELAY}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mb-12 md:mb-16">
            our residents
          </h2>
        </BlurFade>

        <div
          className={`grid ${GRID_COLS_MOBILE} ${GRID_COLS_TABLET} ${GRID_COLS_DESKTOP} gap-8 md:gap-12`}
        >
          {RESIDENTS.map((resident, index) => (
            <BlurFade
              key={resident.name}
              delay={ANIMATION_DELAY + (index + 1) * 0.05}
            >
              <a
                href={resident.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-6 hover:opacity-70 transition-opacity"
                aria-label={resident.name}
              >
                {resident.component ? (
                  <resident.component className="h-8 w-auto sm:h-10 md:h-12" />
                ) : (
                  <img
                    src={resident.image}
                    alt={resident.name}
                    className={
                      resident.name === "Blue Bolt Labs" ||
                      resident.name === "EasyBuzz"
                        ? "h-12 w-auto sm:h-14 md:h-16 object-contain"
                        : "h-8 w-auto sm:h-10 md:h-12 object-contain"
                    }
                    loading="lazy"
                  />
                )}
              </a>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
};

export { OurResidents };
