"use client";

import { Button } from "@residence/ui/components/shadcn/button";
import { ScrollArea } from "@residence/ui/components/shadcn/scroll-area";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatedNavigation } from "@/components/landing/navigation";
import { BGPattern } from "@/components/ui/bg-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/components/ui/morphing-dialog";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const cards = [
  {
    title: "getting here",
    description: "location, trains, parking, and drop-off",
    image: "/aicb.webp",
    detailedContent: `
      <h3 class="font-semibold mb-2">Location</h3>
      <p class="mb-2">Level 8, Bangunan AICB, 10, Jalan Dato Onn, Kuala Lumpur, 50480 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur</p>
      <p class="mb-4"><a href="https://share.google/myz9mLNDYnHJAaNKY" class="text-blue-600 dark:text-blue-400 underline">View on Google Maps</a></p>

      <div class="mb-4 flex justify-center">
        <img src="/location.webp" alt="500 Social House Location Map" class="w-full max-w-[600px] h-auto rounded-lg shadow-md" />
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Public Transportation</h3>
      <p class="mb-4">For train commuters, the building is a 1-minute stroll from the <a href="https://maps.app.goo.gl/pBjDtL3J2KU6Xbnn9" target="_blank" class="text-blue-600 dark:text-blue-400 underline">Bank Negara KTM Station</a> and a 5-minute walk from the <a href="https://maps.app.goo.gl/XHEsTGxfgdGDySCm7" target="_blank" class="text-blue-600 dark:text-blue-400 underline">Bandaraya LRT Station</a>.</p>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Drop-off Point</h3>
      <p class="mb-4">North Lobby - nearest to 500 Social House on Level 8</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <img src="/drop-off-1.webp" alt="Drop-off point view 1" class="w-full h-auto rounded-lg shadow-md" />
        <img src="/drop-off-2.webp" alt="Drop-off point view 2" class="w-full h-auto rounded-lg shadow-md" />
        <img src="/drop-off-3.webp" alt="Drop-off point view 3" class="w-full h-auto rounded-lg shadow-md md:col-span-2" />
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Visitor Parking</h3>
      <p class="mb-2">Follow the "AICB Pedestrian Tunnel" signs to reach the car park lift lobby on the ground floor.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <img src="/parking-1.webp" alt="AICB Parking view 1" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/parking-2.webp" alt="AICB Parking view 2" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/parking-3.webp" alt="AICB Parking view 3" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/parking-4.webp" alt="AICB Parking view 4" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
      </div>
    `,
  },
  {
    title: "getting in",
    description: "lobby registration and door access",
    image: "/access.webp",
    detailedContent: `
      <h3 class="font-semibold mb-2">AICB Building Access (North Lobby)</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Register at the front desk or kiosk with your identity card or passport</li>
        <li>Tap your visitor badge at the turnstile to enter</li>
        <li>Insert the badge into the barrier slot to exit</li>
      </ul>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <img src="/access-1.webp" alt="AICB Building access view 1" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/access-2.webp" alt="AICB Building access view 2" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/access-3.webp" alt="AICB Building access view 3" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/access-4.webp" alt="AICB Building access view 4" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">500 Social House Access</h3>
      <p class="mb-4">We have a door access system in place for 500 Social House on Level 8. Note that this is a separate system from the AICB Building access.</p>

      <p class="mb-4">Visit our <a href="/register" class="text-blue-600 dark:text-blue-400 underline">registration page</a> to get started.</p>
    `,
  },
  {
    title: "how we roll",
    description: "guidelines, demo days, guests, and residency",
    image: "/community.webp",
    detailedContent: `
      <h3 class="font-semibold mb-2">What We're About</h3>
      <ul class="list-disc list-inside mb-4">
        <li><strong>We ship:</strong> Actually building things and putting them out there. Show us what you're working on.</li>
        <li><strong>We help:</strong> If you know something, share it. If you need help, ask. That's how we all get better.</li>
        <li><strong>We vibe:</strong> Nobody's trying to one-up each other here. We're all just trying to build cool stuff.</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Dress Code</h3>
      <p class="mb-3">We're in a bank building (AICB), so we need to dress accordingly. If we don't respect their dress code, we all lose access to this space.</p>

      <div class="mb-4">
        <p class="font-medium mb-2">What to wear:</p>
        <ul class="list-disc list-inside mb-3">
          <li>Closed-toe shoes</li>
          <li>Pants or long skirts</li>
          <li>Collared shirts or appropriate tops</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2 text-red-600 dark:text-red-400">What NOT to wear:</p>
        <ul class="list-disc list-inside mb-3">
          <li>Slippers, sandals, or flip-flops</li>
          <li>Short shorts, miniskirts, or minidresses</li>
          <li>Singlets, tank tops, or crop tops</li>
        </ul>
      </div>
    `,
  },
  {
    title: "housekeeping",
    description: "wifi, hours, pantry, and cleaning",
    image: "/housekeeping.webp",
    detailedContent: `
      <h3 class="font-semibold mb-2">Operating Hours & Visitors Policy</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Office Hours: 9am - 6pm (weekdays)</li>
        <li>Visitor access: 9am - 5:30pm (weekdays)</li>
        <li>Submit visitor registration form 2 working days in advance</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">WiFi</h3>
      <p class="mb-1"><strong>ID:</strong> Guest@500Global</p>
      <p class="mb-4"><strong>Password:</strong> 500Malaysia</p>

      <div class="mb-4 flex flex-col items-center">
        <img src="/wifi-qr.webp" alt="WiFi QR Code" class="w-64 h-auto rounded-lg shadow-md" />
        <p class="mt-2 text-sm text-muted-foreground">Scan to connect to WiFi</p>
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Pantry Guidelines</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Water, coffee, and tea are available at the pantry</li>
        <li>Dispose of any trash in the designated bin under the sink</li>
        <li>Keep the area clean and tidy</li>
      </ul>
    `,
  },
  {
    title: "the space",
    description: "desks, common areas, and meeting rooms",
    image: "/workspace.webp",
    detailedContent: `
      <div class="mb-4 flex justify-center">
        <img src="/workspace-1.webp" alt="500 Social House workspace" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
      </div>

      <h3 class="font-semibold mb-2">Coworking Areas</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Singapore (4-6 pax)</li>
        <li>Seoul (3-4 pax)</li>
        <li>Miami (2-3 pax)</li>
      </ul>

      <h3 class="font-semibold mb-2">Common Areas</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Zen Garden (4-6 pax)</li>
        <li>Window Seats (2-6 pax)</li>
        <li>Living Area</li>
        <li>Communal Dining</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Meeting Rooms</h3>
      <ul class="list-disc list-inside mb-4">
        <li><strong>Abu Dhabi</strong> (4-5 pax) - Smart TV, HDMI</li>
        <li><strong>London</strong> (8-10 pax) - Whiteboard, Monitor, Projector</li>
        <li><strong>Davos</strong> (10+ pax) - Whiteboard, Smart TV, HDMI</li>
      </ul>
    `,
  },
  {
    title: "safety first",
    description: "fire drills, exits, and emergencies",
    image: "/evacuation.webp",
    detailedContent: `
      <h3 class="font-semibold mb-2">Fire Drill Announcement Procedures</h3>

      <div class="mb-4">
        <p class="font-medium mb-2">First Announcement - Standby Phase:</p>
        <ul class="list-disc list-inside mb-3">
          <li>All team members should remain on standby for the second announcement</li>
          <li>Prepare for either full evacuation or stand-down if false alarm</li>
          <li>Gather personal belongings and valuables</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">Second Announcement - Full Evacuation:</p>
        <ul class="list-disc list-inside mb-3">
          <li>Begin evacuation immediately</li>
          <li>Proceed to the nearest assembly point (North or South)</li>
          <li>Walk calmly - do not run</li>
        </ul>
      </div>

      <h3 class="font-semibold mb-2">Emergency Exit Guidelines</h3>
      <ul class="list-disc list-inside mb-4">
        <li>All emergency exits are marked with green signage</li>
        <li><strong>Never use elevators</strong> during fire emergencies</li>
        <li>Use designated stairwells for safe evacuation</li>
      </ul>
    `,
  },
  {
    title: "building amenities",
    description: "library, cafe, prayer room, and facilities",
    image: "/building.webp",
    detailedContent: `
      <div class="mb-4 flex justify-center">
        <img src="/building-1.webp" alt="AICB Building amenities" class="w-full max-w-[500px] h-auto rounded-lg shadow-md" />
      </div>

      <p class="mb-3">As part of AICB's integrated masterplan, the building provides a multitude of facilities for its tenants:</p>
      <ul class="list-disc list-inside mb-4">
        <li>Sick Bay (L4)</li>
        <li>Lactation Room (L4)</li>
        <li>BNM Financial Services Library (G)</li>
        <li>External Bulk Printing Services (G)</li>
        <li>Cafe (G)</li>
        <li>ATM (G)</li>
        <li>Mail Room (B1)</li>
        <li>Prayer Room (B1)</li>
        <li>Car Park (B1 and B2)</li>
      </ul>
    `,
  },
  {
    title: "where to eat",
    description: "cafes, food courts, and delivery",
    image: "/eat.webp",
    detailedContent: `
      <h3 class="font-semibold mb-2">In AICB Building</h3>

      <div class="mb-4">
        <p class="font-medium mb-2">Gigi Coffee</p>
        <ul class="list-disc list-inside mb-3">
          <li>Located right next to our lift lobby</li>
          <li>Quaint cafe serving pastries and drinks</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">Thyme Out</p>
        <ul class="list-disc list-inside mb-3">
          <li>Good quality food with decent portions at great prices</li>
          <li>Wide variety of options - Western, Eastern, rice dishes, desserts</li>
        </ul>
      </div>

      <div class="mb-4 flex justify-center">
        <img src="/eat-1.webp" alt="Thyme Out restaurant" class="w-full max-w-[500px] h-auto rounded-lg shadow-md" />
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Food Delivery</h3>
      <ul class="list-disc list-inside mb-4">
        <li>GrabFood, FoodPanda, ShopeeFood</li>
        <li>Deliveries arrive at North Lobby</li>
      </ul>
    `,
  },
];

function getPatternFill(theme: string | undefined): string {
  if (theme === "dark") {
    return "rgba(255, 255, 255, 0.15)";
  }
  if (theme === "light") {
    return "rgba(0, 0, 0, 0.12)";
  }
  return "rgba(128, 128, 128, 0.1)";
}

export default function GuidePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center">
      <BGPattern
        className="fixed inset-0 z-0"
        fill={getPatternFill(theme)}
        mask="fade-edges"
        size={40}
        variant="grid"
      />

      <AnimatedNavigation />

      <section className="relative w-full pt-24 pb-4 sm:pt-32">
        <div className="container mx-auto px-4">
          <BlurFade delay={0}>
            <Link className="mb-6 inline-block" href="/">
              <Button className="gap-2 font-mono" size="sm" variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                back
              </Button>
            </Link>
          </BlurFade>

          <BlurFade delay={0.05}>
            <div className="mx-auto mb-4 max-w-2xl text-center">
              <h1 className="mb-4 font-nineties text-4xl sm:text-5xl md:text-6xl">
                our house
              </h1>
              <p className="text-lg text-muted-foreground">
                how to use the space
              </p>
            </div>
          </BlurFade>
        </div>
      </section>

      <section className="relative w-full pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto w-full max-w-4xl">
            <div className="flex min-h-[500px] flex-col justify-center space-y-4 rounded-lg p-4">
              <motion.div
                animate="visible"
                className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2"
                initial="hidden"
                variants={containerVariants}
              >
                {cards.map((card) => (
                  <motion.div
                    className="h-full"
                    key={`card-${card.title}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MorphingDialog
                      key={card.title}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 24,
                      }}
                    >
                      <MorphingDialogTrigger className="h-full w-full rounded border border-gray-200/60 bg-white dark:border-zinc-700/60 dark:bg-zinc-900">
                        <div className="flex h-full items-center space-x-3 p-3">
                          <MorphingDialogImage
                            alt={card.title}
                            className="h-8 w-8 rounded object-cover object-top"
                            src={card.image}
                          />
                          <div className="flex flex-1 flex-col items-start justify-center space-y-0">
                            <MorphingDialogTitle className="text-left font-medium font-nineties text-base text-gray-900 sm:text-lg dark:text-gray-100">
                              {card.title}
                            </MorphingDialogTitle>
                            <MorphingDialogSubtitle className="line-clamp-1 text-left text-[10px] text-gray-600 sm:text-xs dark:text-gray-400">
                              {card.description}
                            </MorphingDialogSubtitle>
                          </div>
                        </div>
                      </MorphingDialogTrigger>
                      <MorphingDialogContainer>
                        <MorphingDialogContent className="relative h-auto w-[500px] rounded-xl border border-gray-100 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                          <ScrollArea className="h-[90vh]" type="scroll">
                            <div className="relative p-6">
                              <div className="flex justify-center py-10">
                                <MorphingDialogImage
                                  alt={card.title}
                                  className="h-auto w-full max-w-[400px]"
                                  src={card.image}
                                />
                              </div>
                              <div className="">
                                <MorphingDialogTitle className="font-nineties text-3xl text-gray-900 sm:text-4xl dark:text-gray-100">
                                  {card.title}
                                </MorphingDialogTitle>
                                <MorphingDialogSubtitle className="font-light text-gray-400 dark:text-gray-500">
                                  {card.description}
                                </MorphingDialogSubtitle>
                                <div
                                  className="mt-4 text-gray-700 text-sm dark:text-gray-300"
                                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is hardcoded, not user input
                                  dangerouslySetInnerHTML={{
                                    __html: card.detailedContent,
                                  }}
                                />
                              </div>
                            </div>
                          </ScrollArea>
                          <MorphingDialogClose className="text-zinc-500 dark:text-zinc-400" />
                        </MorphingDialogContent>
                      </MorphingDialogContainer>
                    </MorphingDialog>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
