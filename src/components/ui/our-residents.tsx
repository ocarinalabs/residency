import { BlurFade } from "@/components/ui/blur-fade";
import {
  ReplyrAI,
  CleveAI,
  DocuAsk,
  ResidentImages,
  StealthStartup,
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
  size?: string; // Custom size class for individual logos
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
    size: "h-5 w-auto sm:h-6 md:h-8 max-w-[100px] object-contain",
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
    size: "h-8 w-auto sm:h-10 md:h-12 max-w-[140px] object-contain",
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
    link: "/register",
    name: "You?",
  },
];

const OurResidents = () => {
  return (
    <section className="w-full py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <BlurFade delay={ANIMATION_DELAY}>
          <h2 className="font-nineties text-3xl sm:text-4xl md:text-5xl text-center mb-12 md:mb-16">
            our <em>residents</em>
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
                  <resident.component
                    className={
                      resident.size ||
                      "h-6 w-auto sm:h-8 md:h-10 max-w-[120px] object-contain"
                    }
                  />
                ) : resident.image ? (
                  <img
                    src={resident.image}
                    alt={resident.name}
                    className={
                      resident.size ||
                      "h-6 w-auto sm:h-8 md:h-10 max-w-[120px] object-contain"
                    }
                    loading="lazy"
                  />
                ) : (
                  <span className="font-nineties text-2xl sm:text-3xl md:text-4xl italic">
                    {resident.name}
                  </span>
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
