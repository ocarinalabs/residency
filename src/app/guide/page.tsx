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
import { motion } from "framer-motion";

// Animation variants for staggered card entrance
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

      <div class="mb-4">
        <p class="font-medium mb-2">From <a href="https://maps.app.goo.gl/pBjDtL3J2KU6Xbnn9" target="_blank" class="text-blue-600 dark:text-blue-400 underline">Bank Negara KTM Station</a> (1 min, 200m):</p>
        <ul class="list-disc list-inside mb-3">
          <li>Take the exit on your left upon exiting the turnstile</li>
          <li>Go down the stairs and walk along the pathway</li>
          <li>You will see Bangunan AICB on your right</li>
          <li>Enter the building through the South Lobby</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">From <a href="https://maps.app.goo.gl/XHEsTGxfgdGDySCm7" target="_blank" class="text-blue-600 dark:text-blue-400 underline">Bandaraya LRT Station</a> (5 min, 350m):</p>
        <ul class="list-disc list-inside mb-3">
          <li>Upon exiting the turnstile, turn right towards Bank Negara Malaysia</li>
          <li>Go down the stairs and walk along the pathway until you see a pedestrian bridge on your right</li>
          <li>Take the pedestrian bridge and turn right at the end</li>
          <li>Walk towards Jalan Dato' Onn - Bangunan AICB is on your right</li>
          <li>Turn right and enter through the South Lobby (do not cross Jalan Dato' Onn)</li>
        </ul>
      </div>

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

      <div class="mb-4">
        <p class="font-medium mb-3"><a href="https://parkinginmalaysia.com/aicb-centre-of-excellence-parking-rate/" target="_blank" class="text-blue-600 dark:text-blue-400 underline">AICB Carpark Rates</a> (Effective from 1st March 2024):</p>
        <div class="overflow-x-auto">
          <table class="w-full caption-bottom text-sm border">
            <thead>
              <tr class="border-b">
                <th class="h-10 px-4 text-left align-middle font-medium">Time Period</th>
                <th class="h-10 px-4 text-left align-middle font-medium">Rate (RM)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-4 align-middle">First 3 hours</td>
                <td class="p-4 align-middle">6.00</td>
              </tr>
              <tr class="border-b">
                <td class="p-4 align-middle">Next 3 hours</td>
                <td class="p-4 align-middle">6.00</td>
              </tr>
              <tr class="border-b">
                <td class="p-4 align-middle">Subsequent hours</td>
                <td class="p-4 align-middle">3.00</td>
              </tr>
              <tr>
                <td class="p-4 align-middle font-medium">Maximum per day</td>
                <td class="p-4 align-middle font-medium">15.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-3">Alternative Car Parks:</p>

        <p class="font-medium text-sm mb-2">
          <a href="https://maps.app.goo.gl/RoZWeeR7CGKRNRSq7" target="_blank" class="text-blue-600 dark:text-blue-400 underline">ASB Academic</a>
          <span class="font-normal"> (Monday to Saturday, 8AM - 5PM):</span>
        </p>
        <div class="overflow-x-auto mb-3">
          <table class="w-full caption-bottom text-sm border">
            <thead>
              <tr class="border-b">
                <th class="h-10 px-4 text-left align-middle font-medium">Duration</th>
                <th class="h-10 px-4 text-left align-middle font-medium">Rate (RM)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-4 align-middle">First 4 hours</td>
                <td class="p-4 align-middle">5.00</td>
              </tr>
              <tr class="border-b">
                <td class="p-4 align-middle">Subsequent hours</td>
                <td class="p-4 align-middle">2.00</td>
              </tr>
              <tr>
                <td class="p-4 align-middle font-medium">Maximum per day</td>
                <td class="p-4 align-middle font-medium">15.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="font-medium text-sm mb-1">
          <a href="https://maps.app.goo.gl/BL4yJKunw17VUovz8" target="_blank" class="text-blue-600 dark:text-blue-400 underline">Sasana Kijang, Bank Negara Malaysia</a>
          <span class="font-normal"> (450m, 1-minute walk):</span>
        </p>
        <ul class="list-disc list-inside text-sm">
          <li>Available in LG3, LG4, and LG5</li>
          <li>RM 5 per entry (Touch'n Go card only)</li>
          <li>Monday 8:00AM - 6:30PM</li>
          <li>Tuesday to Sunday 10:00AM - 5:00PM</li>
        </ul>
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

      <h3 class="font-semibold mb-2">Demo Day Policy</h3>
      <p class="mb-3">Every week we host demo days where anyone can come show what they're building.</p>
      <ul class="list-disc list-inside mb-4">
        <li>Open to everyone - bring your projects</li>
        <li>Register at <a href="/register" class="text-blue-600 dark:text-blue-400 underline">500.house/register</a></li>
        <li>We post events on Luma so check there for dates</li>
        <li>Come ready to present what you're working on</li>
        <li>Follow the dress code and house rules</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Guest Policy</h3>
      <p class="mb-3">Want to bring someone? Here's how it works:</p>
      <ul class="list-disc list-inside mb-4">
        <li>Guests must be invited by a permanent resident</li>
        <li>Register your guest in advance - no walk-ins</li>
        <li>If you invite someone, you're responsible for them</li>
        <li>Your guest should be building something real, not just hanging out</li>
        <li>You need to be there with your guest - no dropping people off</li>
        <li>Community leaders might need to approve depending on the situation</li>
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

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Pathway to AI Residency</h3>
      <p class="mb-3">Want to be part of the community long-term? Here's the path:</p>

      <div class="mb-4">
        <p class="font-medium mb-2">Step 1: Come to demo days (at least 2 times)</p>
        <ul class="list-disc list-inside mb-3">
          <li>Show up and present what you're building</li>
          <li>Talk to people, get involved in the community</li>
          <li>Let people see you're serious about shipping</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">Step 2: Apply for residency</p>
        <ul class="list-disc list-inside mb-3">
          <li>Fill out the application form</li>
          <li>Show us your work (GitHub, portfolio, whatever you've built)</li>
          <li>Tell us what you're working on and why</li>
          <li>Get 1-2 existing residents to vouch for you</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">Step 3: Trial period (1-2 months)</p>
        <ul class="list-disc list-inside mb-3">
          <li>You'll be invited to come work during the week</li>
          <li>Keep shipping - we want to see consistent progress</li>
          <li>Help other people when you can</li>
          <li>Maybe run a workshop or share what you know</li>
          <li>Follow the rules and respect the space</li>
          <li>Community leaders will check if you're a good fit</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">Step 4: Full residency</p>
        <ul class="list-disc list-inside mb-4">
          <li>Community leaders and residents vote on you</li>
          <li>We're looking for: consistent building, helping others, good vibes, follows rules</li>
          <li>Get approved → you get door access</li>
          <li>You can invite your own guests (within the policy above)</li>
          <li>We'll check in every few months to make sure you're still active</li>
        </ul>
      </div>
    `,
  },
  {
    title: "housekeeping",
    description: "wifi, hours, pantry, and cleaning",
    image: "/housekeeping.webp",
    detailedContent: `
      <h3 class="font-semibold mb-2">Office Support</h3>
      <p class="mb-4">Our Office Manager will be here to support you on weekdays from 9AM - 6PM. Should you need any help around the office, please reach out to our Office Manager and/or the Operations team (Adelyn, Suzi).</p>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

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

      <h3 class="font-semibold mb-2">Workstation</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Keep your workstation clean and tidy</li>
        <li>The cleaner will wipe all tables every morning</li>
        <li>Be wary - eating at your workstation without cleaning crumbs can attract unwanted guests</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Meeting Room Etiquette</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Follow specified check-in and check-out times</li>
        <li>Allow a 30-minute gap between meetings for cleaning</li>
        <li>Switch off electrical appliances and lights after use</li>
        <li>Eating in meeting rooms is not encouraged</li>
        <li>Return all borrowed equipment to designated locations</li>
        <li>Book via Google Calendar</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Pantry Guidelines</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Water, coffee, and tea are available at the pantry</li>
        <li>Dispose of any trash in the designated bin under the sink</li>
        <li>Dispose of leftover food and drinks only in pantry bins</li>
        <li>Keep the area clean and tidy, and put items back in their original place</li>
        <li>Switch off lights and electronic devices after use</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Keeping Our Social House Clean</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Keep common areas and meeting rooms neat and clean</li>
        <li>After using the pantry or other shared spaces, kindly clean up after yourself</li>
        <li>Cleaning services available 8:00am to 4:30pm on weekdays</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Health & Safety</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Practice good personal hygiene - wash/sanitize hands frequently</li>
        <li>Discard used tissues and masks immediately in bins with lids</li>
        <li>If sick and must visit, please wear a face mask</li>
        <li>If exposed to an infectious disease, self-monitor and test</li>
        <li>Self-quarantine if tested positive</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">No Smoking Policy</h3>
      <ul class="list-disc list-inside mb-4">
        <li>500 Social House is a non-smoking zone</li>
        <li>No vaping allowed in any indoor areas</li>
        <li>Designated smoking area: Ground floor at North Lobby, near the fountain</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Save Electricity</h3>
      <p class="mb-2">If you are the last to leave the office, please switch off all the lights around the office. The switches are located:</p>
      <ul class="list-disc list-inside mb-4">
        <li>AI Residency</li>
        <li>Main Entrance</li>
        <li>500 Office</li>
        <li>Communal Pendant</li>
      </ul>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <img src="/housekeeping-2.webp" alt="Electricity switch 1" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/housekeeping-3.webp" alt="Electricity switch 2" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/housekeeping-4.webp" alt="Electricity switch 3" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/housekeeping-5.webp" alt="Electricity switch 4" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">FAQs</h3>
      <div class="space-y-3 mb-4">
        <div>
          <p class="font-medium">Are there TVs/Projectors available?</p>
          <p class="text-sm">TVs in Las Vegas and Davos rooms. Projector in London room. Connect via HDMI cable. <a href="https://docs.google.com/document/d/14Zn1xLKYLauUfPhRriIVU-EreJABPergtPM5p-Tu5cY" target="_blank" class="text-blue-600 dark:text-blue-400 underline">View Screen Mirroring Guide</a></p>
        </div>
        <div>
          <p class="font-medium">Can seating be rearranged?</p>
          <p class="text-sm">It's best to keep the arrangement as is. If adjusted, you must return it to the original setup. Please note that your company will be liable for any costs incurred, including damages to furniture, flooring, or stains.</p>
        </div>
        <div>
          <p class="font-medium">Can we bring food into meeting rooms?</p>
          <p class="text-sm">Yes, the dining table in the living room is available. Please clean up after meals. Food deliveries arrive at the North Lobby. Last trash collection is at 4:30 PM.</p>
        </div>
      </div>
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
        <li>Bangkok (2-4 pax, unavailable)</li>
        <li>Seoul (3-4 pax)</li>
        <li>Cairo (1 pax, unavailable)</li>
        <li>Riyadh (1 pax, unavailable)</li>
        <li>Miami (2-3 pax)</li>
        <li>Tokyo (3-4 pax, unavailable)</li>
      </ul>

      <h3 class="font-semibold mb-2">Common Areas</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Zen Garden (4-6 pax)</li>
        <li>Window Seats (2-6 pax)</li>
        <li>Living Area</li>
        <li>Communal Dining</li>
      </ul>

      <h3 class="font-semibold mb-2">Coworking Areas</h3>
      <div class="space-y-4 mb-4">
        <div class="flex flex-col items-center">
          <img src="/room-singapore.webp" alt="Singapore Coworking Area" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Singapore</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-bangkok.webp" alt="Bangkok Coworking Area" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Bangkok</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-seoul.webp" alt="Seoul Coworking Area" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Seoul</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-cairo.webp" alt="Cairo Coworking Area" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Cairo</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-riyadh.webp" alt="Riyadh Coworking Area" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Riyadh</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-miami.webp" alt="Miami Coworking Area" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Miami</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-tokyo.webp" alt="Tokyo Coworking Area" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Tokyo</p>
        </div>
      </div>

      <h3 class="font-semibold mb-2 mt-4">Common Areas</h3>
      <div class="space-y-4 mb-4">
        <div class="flex flex-col items-center">
          <img src="/room-green.webp" alt="Zen Garden" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <img src="/room-green-2.webp" alt="Zen Garden 2" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md mt-2" />
          <p class="mt-2 text-sm text-muted-foreground">Zen Garden</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-living.webp" alt="Living Area" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Living Area</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-dining.webp" alt="Communal Dining" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Communal Dining</p>
        </div>
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Meeting Rooms</h3>
      <ul class="list-disc list-inside mb-4">
        <li><strong>Miami</strong> (3 pax)</li>
        <li><strong>Tokyo</strong> (3-4 pax, unavailable)<br/>Amenities: Whiteboard, Meta Portal</li>
        <li><strong>Abu Dhabi</strong> (4-5 pax)<br/>Amenities: Smart TV, HDMI</li>
        <li><strong>London</strong> (8-10 pax)<br/>Amenities: Whiteboard, Monitor, Projector, Smart TV, HDMI, Meta Portal</li>
        <li><strong>Davos</strong> (10 pax and above)<br/>Amenities: Whiteboard, Smart TV, HDMI</li>
      </ul>

      <div class="space-y-4 mb-4">
        <div class="flex flex-col items-center">
          <img src="/room-miami.webp" alt="Miami Meeting Room" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Miami</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-tokyo.webp" alt="Tokyo Meeting Room" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Tokyo</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-abudhabi.webp" alt="Abu Dhabi Meeting Room" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Abu Dhabi</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-london.webp" alt="London Meeting Room" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">London</p>
        </div>
        <div class="flex flex-col items-center">
          <img src="/room-davos.webp" alt="Davos Meeting Room" class="w-full max-w-[500px] aspect-[4/3] object-cover rounded-lg shadow-md" />
          <p class="mt-2 text-sm text-muted-foreground">Davos</p>
        </div>
      </div>
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
          <li>Shut down electrical appliances when possible</li>
          <li>Gather personal belongings and valuables</li>
          <li>Wear appropriate footwear for using stairs (avoid high heels)</li>
          <li>Remain calm and prepare to evacuate safely</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">Second Announcement - Full Evacuation:</p>
        <ul class="list-disc list-inside mb-3">
          <li>Begin evacuation immediately</li>
          <li>Proceed to the nearest assembly point (North or South)</li>
          <li>Follow the Standby Floor Warden to the assembly point</li>
          <li>Walk calmly - do not run</li>
          <li>Hold handrails when using stairs</li>
          <li>Main Floor Warden will be the last person to evacuate, ensuring all doors are secured</li>
        </ul>
      </div>

      <h3 class="font-semibold mb-2">Assembly Points</h3>
      <ul class="list-disc list-inside mb-4">
        <li><strong>North Assembly Point:</strong> North Lobby area</li>
        <li><strong>South Assembly Point:</strong> South Lobby area</li>
        <li>Refer to the emergency floor plan posted on Level 8</li>
      </ul>

      <h3 class="font-semibold mb-2">Emergency Exit Guidelines</h3>
      <ul class="list-disc list-inside mb-4">
        <li>All emergency exits are marked with green signage</li>
        <li>Familiarize yourself with the nearest exit locations</li>
        <li><strong>Never use elevators</strong> during fire emergencies</li>
        <li>Use designated stairwells for safe evacuation</li>
        <li>Do not re-enter the building until the all-clear is given</li>
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
        <li>Community Wellness activities</li>
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
          <li>Perfect for quick meetups or bites</li>
          <li>Ideal when pressed for time</li>
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

      <h3 class="font-semibold mb-2">Nearby Food Courts</h3>

      <div class="mb-4">
        <p class="font-medium mb-2">How to get there:</p>
        <p class="mb-2">With AICB on your left, walk straight until you reach the big tree.</p>
        <ul class="list-disc list-inside mb-3">
          <li><strong>SOGO Food Garden</strong> - Cross bridge through train station</li>
          <li><strong>Bank Negara Food Court</strong> - Head straight past the tree, on your left</li>
        </ul>
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Food Delivery</h3>

      <div class="mb-4">
        <p class="font-medium mb-2">Delivery Options:</p>
        <ul class="list-disc list-inside mb-3">
          <li>GrabFood (free delivery available)</li>
          <li>FoodPanda</li>
          <li>ShopeeFood</li>
        </ul>
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <div class="mb-4">
        <p class="font-medium mb-2">Delivery Collection Process:</p>
        <ul class="list-disc list-inside mb-3">
          <li>Deliveries can be left at North lobby counter</li>
          <li>Collect at your convenience if in meetings</li>
          <li>Encouraged to personally collect when possible</li>
          <li>Reduces strain on lobby staff</li>
          <li>Ensures prompt inspection of items</li>
        </ul>
      </div>
    `,
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
              <Button variant="ghost" size="sm" className="gap-2 font-mono">
                <ArrowLeft className="h-4 w-4" />
                back
              </Button>
            </Link>
          </BlurFade>

          <BlurFade delay={0.05}>
            <div className="text-center max-w-2xl mx-auto mb-4">
              <h1 className="font-nineties text-4xl sm:text-5xl md:text-6xl mb-4">
                our house
              </h1>
              <p className="text-muted-foreground text-lg">
                how to use the space
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
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
              >
                {cards.map((card, index) => (
                  <motion.div
                    key={`card-${index}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-full"
                  >
                    <MorphingDialog
                      key={index}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 24,
                      }}
                    >
                      <MorphingDialogTrigger
                        style={{
                          borderRadius: "4px",
                        }}
                        className="border border-gray-200/60 bg-white dark:border-zinc-700/60 dark:bg-zinc-900 h-full w-full"
                      >
                        <div className="flex items-center space-x-3 p-3 h-full">
                          <MorphingDialogImage
                            src={card.image}
                            alt={card.title}
                            className="h-8 w-8 object-cover object-top"
                            style={{
                              borderRadius: "4px",
                            }}
                          />
                          <div className="flex flex-col items-start justify-center space-y-0 flex-1">
                            <MorphingDialogTitle className="font-nineties text-base font-medium text-gray-900 dark:text-gray-100 sm:text-lg text-left">
                              {card.title}
                            </MorphingDialogTitle>
                            <MorphingDialogSubtitle className="text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs text-left line-clamp-1">
                              {card.description}
                            </MorphingDialogSubtitle>
                          </div>
                        </div>
                      </MorphingDialogTrigger>
                      <MorphingDialogContainer>
                        <MorphingDialogContent
                          style={{
                            borderRadius: "12px",
                          }}
                          className="relative h-auto w-[500px] border border-gray-100 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                        >
                          <ScrollArea className="h-[90vh]" type="scroll">
                            <div className="relative p-6">
                              <div className="flex justify-center py-10">
                                <MorphingDialogImage
                                  src={card.image}
                                  alt={card.title}
                                  className="h-auto w-full max-w-[400px]"
                                />
                              </div>
                              <div className="">
                                <MorphingDialogTitle className="font-nineties text-3xl sm:text-4xl text-gray-900 dark:text-gray-100">
                                  {card.title}
                                </MorphingDialogTitle>
                                <MorphingDialogSubtitle className="font-light text-gray-400 dark:text-gray-500">
                                  {card.description}
                                </MorphingDialogSubtitle>
                                <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: card.detailedContent,
                                    }}
                                  />
                                </div>
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
