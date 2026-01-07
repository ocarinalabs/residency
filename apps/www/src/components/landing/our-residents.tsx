import Image from "next/image";
import type { ComponentType } from "react";
import {
  CleveAI,
  DocuAsk,
  ReplyrAI,
  ResidentImages,
  Robin,
  StealthStartup,
} from "@/components/icons/residents";
import { BlurFade } from "@/components/ui/blur-fade";

const ANIMATION_DELAY = 0.3;

type Resident = {
  name: string;
  link: string;
  component?: ComponentType<{ className?: string }>;
  image?: string;
  size?: string;
};

function ResidentContent({ resident }: { resident: Resident }) {
  if (resident.component) {
    const Component = resident.component;
    return (
      <Component
        className={
          resident.size ||
          "h-6 w-auto max-w-[120px] object-contain sm:h-8 md:h-10"
        }
      />
    );
  }

  if (resident.image) {
    return (
      <Image
        alt={resident.name}
        className={
          resident.size ||
          "h-6 w-auto max-w-[120px] object-contain sm:h-8 md:h-10"
        }
        height={48}
        src={resident.image}
        width={120}
      />
    );
  }

  return (
    <span className="font-nineties text-2xl italic sm:text-3xl md:text-4xl">
      {resident.name}
    </span>
  );
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

export function OurResidents() {
  return (
    <section className="w-full px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-6xl">
        <BlurFade delay={ANIMATION_DELAY}>
          <h2 className="mb-12 text-center font-nineties text-3xl sm:text-4xl md:mb-16 md:text-5xl">
            our <em>residents</em>
          </h2>
        </BlurFade>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-12 lg:grid-cols-4">
          {RESIDENTS.map((resident, index) => (
            <BlurFade
              delay={ANIMATION_DELAY + (index + 1) * 0.05}
              key={resident.name}
            >
              <a
                aria-label={resident.name}
                className="flex items-center justify-center p-6 transition-opacity hover:opacity-70"
                href={resident.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ResidentContent resident={resident} />
              </a>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
