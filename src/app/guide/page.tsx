"use client";

import { AnimatedNavFramer } from "@/components/ui/navigation-bar-animation";
import { BGPattern } from "@/components/ui/bg-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const cards = [
  {
    title: "Getting Here",
    description: "Directions, parking, and transport options to reach 500 Social House.",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">Address</h3>
      <p class="mb-4">500 Social House is located at AICB Building, Level 5, Jalan Stesen Sentral 2, Kuala Lumpur Sentral, 50470 Kuala Lumpur.</p>

      <h3 class="font-semibold mb-2">By Car</h3>
      <p class="mb-2">Parking is available at the AICB Building basement levels B1 and B2.</p>
      <ul class="list-disc list-inside mb-4">
        <li>RM4 per hour for the first 3 hours</li>
        <li>RM5 per hour after 3 hours</li>
        <li>Maximum daily rate: RM25</li>
      </ul>

      <h3 class="font-semibold mb-2">Public Transport</h3>
      <p class="mb-2">The office is a 5-minute walk from KL Sentral station.</p>
      <ul class="list-disc list-inside mb-4">
        <li>LRT - KL Sentral Station</li>
        <li>MRT - Muzium Negara Station (10 min walk)</li>
        <li>KTM - KL Sentral Station</li>
        <li>Monorail - KL Sentral Station</li>
      </ul>

      <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
        <p class="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Tips</p>
        <ul class="space-y-1">
          <li>• Use Waze or Google Maps for navigation</li>
          <li>• Arrive early for better parking spots</li>
          <li>• Follow signs to AICB Building from KL Sentral</li>
        </ul>
      </div>
    `
  },
  {
    title: "Access & Registration",
    description: "How to get your access card and complete visitor registration.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">First Time Registration</h3>
      <p class="mb-2">All visitors must register through our online system before arrival.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Complete online registration form</li>
        <li>Upload a photo for your ID</li>
        <li>Wait for approval email</li>
        <li>Collect access card at reception</li>
      </ul>

      <h3 class="font-semibold mb-2">Access Card Collection</h3>
      <p class="mb-4">Collect your access card from the reception desk on Level 5.</p>

      <div class="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg mb-4">
        <p class="font-medium text-red-700 dark:text-red-300 mb-1">⚠️ Important</p>
        <ul class="space-y-1">
          <li>• Registration must be done at least 24 hours before visit</li>
        </ul>
      </div>

      <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
        <p class="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Tips</p>
        <ul class="space-y-1">
          <li>• Bring your IC/Passport for verification</li>
          <li>• Cards are valid for the duration of your membership</li>
        </ul>
      </div>
    `
  },
  {
    title: "Housekeeping",
    description: "Guidelines for keeping our shared spaces clean and organized.",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">Cleanliness</h3>
      <p class="mb-2">Keep our shared spaces clean and tidy for everyone.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Clean up after yourself in the pantry</li>
        <li>Dispose of trash properly</li>
        <li>Wipe down surfaces after use</li>
        <li>Return items to their designated places</li>
      </ul>

      <h3 class="font-semibold mb-2">Kitchen & Pantry</h3>
      <p class="mb-4">The pantry is a shared space with complimentary coffee and tea.</p>

      <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
        <p class="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Tips</p>
        <ul class="space-y-1">
          <li>• Label your food in the fridge</li>
          <li>• Clean dishes immediately after use</li>
          <li>• First come, first served for coffee/tea</li>
        </ul>
      </div>
    `
  },
  {
    title: "Workspace Layout",
    description: "Navigate the SEA & Global zones and find your ideal workspace.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">SEA Zone</h3>
      <p class="mb-2">Dedicated area for Southeast Asian startups and teams.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Hot desks available</li>
        <li>Dedicated desks for members</li>
        <li>Standing desks available</li>
        <li>Quiet zone for focused work</li>
      </ul>

      <h3 class="font-semibold mb-2">Global Zone</h3>
      <p class="mb-2">International collaboration space for global teams.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Video conferencing facilities</li>
        <li>Collaboration areas</li>
        <li>Phone booths for private calls</li>
        <li>Lounge area for informal meetings</li>
      </ul>
    `
  },
  {
    title: "House Rules",
    description: "Community guidelines and professional conduct expectations.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">General Conduct</h3>
      <p class="mb-2">Respect all members and maintain professional behavior.</p>
      <ul class="list-disc list-inside mb-4">
        <li>No loud phone conversations in open areas</li>
        <li>Use headphones for audio/video</li>
        <li>Respect others' privacy and workspace</li>
        <li>Professional attire required</li>
      </ul>

      <h3 class="font-semibold mb-2">Operating Hours</h3>
      <p class="mb-4">The space is open Monday to Friday, 8:00 AM to 8:00 PM.</p>

      <div class="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
        <p class="font-medium text-red-700 dark:text-red-300 mb-1">⚠️ Important</p>
        <ul class="space-y-1">
          <li>• Weekend access requires special arrangement</li>
          <li>• After-hours access for members only</li>
        </ul>
      </div>
    `
  },
  {
    title: "Procedures",
    description: "Visitor registration and meeting room booking processes.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">Visitor Registration</h3>
      <p class="mb-2">All visitors must be registered and approved before arrival.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Host must register visitors online</li>
        <li>Visitors receive QR code via email</li>
        <li>Scan QR code at reception</li>
        <li>Visitor badge must be worn at all times</li>
      </ul>

      <h3 class="font-semibold mb-2">Meeting Room Booking</h3>
      <p class="mb-4">Book meeting rooms through the online portal.</p>

      <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg mb-4">
        <p class="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Tips</p>
        <ul class="space-y-1">
          <li>• Book at least 24 hours in advance</li>
          <li>• Maximum 4 hours per booking</li>
          <li>• Cancel if plans change</li>
        </ul>
      </div>

      <div class="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
        <p class="font-medium text-red-700 dark:text-red-300 mb-1">⚠️ Important</p>
        <ul class="space-y-1">
          <li>• No-shows may result in booking privileges suspension</li>
        </ul>
      </div>
    `
  },
  {
    title: "Emergency",
    description: "Safety procedures, emergency contacts, and evacuation routes.",
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">Emergency Contacts</h3>
      <p class="mb-2">Keep these numbers saved in your phone.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Building Security: 03-2234-5678</li>
        <li>Fire/Ambulance: 999</li>
        <li>Police: 999</li>
        <li>500 Social House Manager: 012-345-6789</li>
      </ul>

      <h3 class="font-semibold mb-2">Evacuation Procedures</h3>
      <p class="mb-2">Familiarize yourself with emergency exits.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Emergency exits are marked in green</li>
        <li>Assembly point: Ground floor lobby</li>
        <li>Follow fire wardens' instructions</li>
        <li>Do not re-enter until all clear is given</li>
      </ul>

      <div class="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
        <p class="font-medium text-red-700 dark:text-red-300 mb-1">⚠️ Important</p>
        <ul class="space-y-1">
          <li>• In case of fire, DO NOT use elevators</li>
        </ul>
      </div>
    `
  },
  {
    title: "AICB Amenities",
    description: "Building facilities including gym, prayer room, and services.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">Building Facilities</h3>
      <p class="mb-2">AICB Building offers various amenities for tenants.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Prayer room on Level 3</li>
        <li>Gym on Level 2 (members only)</li>
        <li>Convenience store on Ground floor</li>
        <li>ATMs on Ground floor</li>
      </ul>

      <h3 class="font-semibold mb-2">Services</h3>
      <p class="mb-2">Additional services available in the building.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Concierge service at lobby</li>
        <li>Mail and package handling</li>
        <li>Taxi/Grab pickup point</li>
        <li>Bicycle parking available</li>
      </ul>
    `
  },
  {
    title: "Where to Eat",
    description: "Nearby restaurants, cafes, and food delivery options.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">Nearby Restaurants</h3>
      <p class="mb-2">Plenty of dining options within walking distance.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Ground floor food court</li>
        <li>Level 2 cafes and restaurants</li>
        <li>KL Sentral food options (5 min walk)</li>
        <li>Nu Sentral Mall food court (7 min walk)</li>
      </ul>

      <h3 class="font-semibold mb-2">Food Delivery</h3>
      <p class="mb-2">All major delivery platforms serve this location.</p>
      <ul class="list-disc list-inside mb-4">
        <li>GrabFood</li>
        <li>FoodPanda</li>
        <li>ShopeeFood</li>
      </ul>

      <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
        <p class="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Tips</p>
        <ul class="space-y-1">
          <li>• Collect deliveries at Ground floor lobby</li>
          <li>• Provide "AICB Building" as landmark</li>
          <li>• Include your contact number for riders</li>
        </ul>
      </div>
    `
  },
];

export default function GuidePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center">
      {/* Background pattern for entire page */}
      <BGPattern
        variant="grid"
        mask="fade-edges"
        size={40}
        fill={
          theme === "dark"
            ? "rgba(255, 255, 255, 0.15)"
            : theme === "light"
              ? "rgba(0, 0, 0, 0.12)"
              : "rgba(128, 128, 128, 0.1)"
        }
        className="fixed inset-0 z-0"
      />

      <AnimatedNavFramer />

      {/* Header Section */}
      <section className="relative w-full pt-24 sm:pt-32 pb-4">
        <div className="container mx-auto px-4">
          <BlurFade delay={0}>
            <Link href="/" className="inline-block mb-6">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </BlurFade>

          <BlurFade delay={0.05}>
            <div className="text-center max-w-2xl mx-auto mb-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Office Guide
              </h1>
              <p className="text-muted-foreground text-lg">
                Everything you need to know about 500 Social House
              </p>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Content Section - MinimalCard Grid */}
      <section className="relative w-full pb-20">
        <div className="container mx-auto px-4">
          <div className="w-full max-w-4xl mx-auto">
            <div className="min-h-[500px] p-4 flex flex-col justify-center rounded-lg space-y-4">
              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {cards.map((card, index) => (
                  <MorphingDialog
                    key={index}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 24,
                    }}
                  >
                    <MorphingDialogTrigger
                      style={{
                        borderRadius: '4px',
                      }}
                      className='border border-gray-200/60 bg-white dark:border-zinc-700/60 dark:bg-zinc-900'
                    >
                      <div className='flex items-center space-x-3 p-3'>
                        <MorphingDialogImage
                          src={card.image}
                          alt={card.title}
                          className='h-8 w-8 object-cover object-top'
                          style={{
                            borderRadius: '4px',
                          }}
                        />
                        <div className='flex flex-col items-start justify-center space-y-0 flex-1'>
                          <MorphingDialogTitle className='text-[10px] font-medium text-gray-900 dark:text-gray-100 sm:text-xs text-left'>
                            {card.title}
                          </MorphingDialogTitle>
                          <MorphingDialogSubtitle className='text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs text-left'>
                            {card.description}
                          </MorphingDialogSubtitle>
                        </div>
                      </div>
                    </MorphingDialogTrigger>
                    <MorphingDialogContainer>
                      <MorphingDialogContent
                        style={{
                          borderRadius: '12px',
                        }}
                        className='relative h-auto w-[500px] border border-gray-100 bg-white dark:border-zinc-700 dark:bg-zinc-900'
                      >
                        <ScrollArea className='h-[90vh]' type='scroll'>
                          <div className='relative p-6'>
                            <div className='flex justify-center py-10'>
                              <MorphingDialogImage
                                src={card.image}
                                alt={card.title}
                                className='h-auto w-[200px]'
                              />
                            </div>
                            <div className=''>
                              <MorphingDialogTitle className='text-gray-900 dark:text-gray-100'>
                                {card.title}
                              </MorphingDialogTitle>
                              <MorphingDialogSubtitle className='font-light text-gray-400 dark:text-gray-500'>
                                {card.description}
                              </MorphingDialogSubtitle>
                              <div className='mt-4 text-sm text-gray-700 dark:text-gray-300'>
                                <div dangerouslySetInnerHTML={{ __html: card.detailedContent }} />
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                        <MorphingDialogClose className='text-zinc-500 dark:text-zinc-400' />
                      </MorphingDialogContent>
                    </MorphingDialogContainer>
                  </MorphingDialog>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
