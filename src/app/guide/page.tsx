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
    description:
      "Location, directions, parking, and transport options to reach 500 Social House.",
    image: "/aicb.webp",
    detailedContent: `
      <h3 class="font-semibold mb-2">Location</h3>
      <p class="mb-2">Level 8, Bangunan AICB, 10, Jalan Dato Onn, Kuala Lumpur, 50480 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur</p>
      <p class="mb-4"><a href="https://share.google/myz9mLNDYnHJAaNKY" class="text-blue-600 dark:text-blue-400 underline">View on Google Maps</a></p>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Public Transportation</h3>
      <p class="mb-4">For train commuters, the building is a 1 minute stroll from the Bank Negara KTM Station and a 5 minute walk from the Bandaraya LRT station.</p>

      <div class="mb-4">
        <p class="font-medium mb-2">From Bank Negara KTM Station (1 min, 200m):</p>
        <ul class="list-disc list-inside mb-3">
          <li>Take the exit on your left upon exiting the turnstile</li>
          <li>Go down the stairs and walk along the pathway</li>
          <li>You will see Bangunan AICB on your right</li>
          <li>Enter the building through the South Lobby</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">From Bandaraya LRT Station (5 min, 350m):</p>
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
      <p class="mb-4">North Lobby - nearest to the 500 Social House on Level 8</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <img src="/drop-off-1.webp" alt="Drop-off point view 1" class="w-full h-auto rounded-lg shadow-md" />
        <img src="/drop-off-2.webp" alt="Drop-off point view 2" class="w-full h-auto rounded-lg shadow-md" />
        <img src="/drop-off-3.webp" alt="Drop-off point view 3" class="w-full h-auto rounded-lg shadow-md md:col-span-2" />
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Visitor Parking</h3>
      <p class="mb-2">Follow the "AICB Pedestrian Tunnel" signs to reach the car park lift lobby on Ground floor.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <img src="/parking-1.webp" alt="AICB Parking view 1" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/parking-2.webp" alt="AICB Parking view 2" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/parking-3.webp" alt="AICB Parking view 3" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/parking-4.webp" alt="AICB Parking view 4" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
      </div>

      <div class="mb-4">
        <p class="font-medium mb-3">AICB Carpark Rates (Effective from 1st March 2024):</p>
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
          <span class="font-normal"> (Monday to Saturday, 8am to 5pm):</span>
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
          <span class="font-normal"> (450m, 1 min walk):</span>
        </p>
        <ul class="list-disc list-inside text-sm">
          <li>Available in LG3, LG4 and LG5</li>
          <li>RM 5 per entry (Touch'n Go card only)</li>
          <li>Monday 8:00am - 6:30pm</li>
          <li>Tuesday to Sunday 10:00am - 5:00pm</li>
        </ul>
      </div>
    `,
  },
  {
    title: "Access & Registration",
    description:
      "AICB Building access and Nuveq door system registration process.",
    image: "/access.webp",
    detailedContent: `
      <h3 class="font-semibold mb-2">AICB Building Access</h3>
      <p class="mb-2">Register at North Lobby upon arrival:</p>
      <ul class="list-disc list-inside mb-4">
        <li>Register at front desk or kiosk</li>
        <li>Required document: Identity card or passport</li>
        <li>Tap visitor badge at turnstile to enter</li>
        <li>Insert badge into barrier slot to exit</li>
      </ul>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <img src="/access-1.webp" alt="AICB Building access view 1" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/access-2.webp" alt="AICB Building access view 2" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/access-3.webp" alt="AICB Building access view 3" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/access-4.webp" alt="AICB Building access view 4" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">500 Social House - Nuveq Door System</h3>
      <p class="mb-4">We have Nuveq Door Access System for Level 8. This is separate from AICB Building Access.</p>

      <div class="mb-4">
        <p class="font-medium mb-2">To register for door access:</p>
        <ul class="list-disc list-inside mb-3">
          <li>Visit <a href="/register" class="text-blue-600 dark:text-blue-400 underline">our registration page</a> and follow the step-by-step guide</li>
          <li>Once approved, you'll receive an access link via email</li>
          <li>Remember to keep Bluetooth enabled on your phone</li>
        </ul>
      </div>

    `,
  },
  {
    title: "House Rules & Guidelines",
    description:
      "Operating policies, WiFi, health & safety, and guidelines for our shared spaces.",
    image: "/housekeeping.webp",
    detailedContent: `
      <h3 class="font-semibold mb-2">Office Support</h3>
      <p class="mb-4">Our Office Manager will be here to support you on weekdays from 9am-6pm. Should you need any help around the office, please reach out to our Office Manager and/or the Operations team support (Adelyn, Suzi).</p>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Guest WiFi</h3>
      <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p class="mb-1"><strong>ID:</strong> Guest@500Global</p>
        <p class="mb-1"><strong>Password:</strong> 500Malaysia</p>
        <p class="mt-2"><a href="https://docs.google.com/document/d/14Zn1xLKYLauUfPhRriIVU-EreJABPergtPM5p-Tu5cY" target="_blank" class="text-blue-600 dark:text-blue-400 underline">View Screen Mirroring Guide</a></p>
      </div>

      <div class="mb-4 flex justify-center">
        <img src="/wifi-qr.webp" alt="WiFi QR Code" class="w-64 h-auto rounded-lg shadow-md" />
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Save Electricity</h3>
      <p class="mb-2">If you are the last to leave the office, please switch off all lights at:</p>
      <ul class="list-disc list-inside mb-4">
        <li>Entrance switch</li>
        <li>500 Team - Main Section</li>
        <li>AI Residency Section</li>
        <li>Communal Pendant Light</li>
      </ul>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <img src="/housekeeping-2.webp" alt="Electricity switch 1" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/housekeeping-3.webp" alt="Electricity switch 2" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/housekeeping-4.webp" alt="Electricity switch 3" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
        <img src="/housekeeping-5.webp" alt="Electricity switch 4" class="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Keeping Our Social House Clean</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Contribute to keeping common areas and meeting rooms neat and clean</li>
        <li>After using the pantry or other shared spaces, kindly clean up after yourself</li>
        <li>Cleaner support available 8:00am to 4:30pm on weekdays</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Pantry Guidelines</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Water, coffee and tea are available at the pantry</li>
        <li>Dispose of any trash in designated bin under the sink</li>
        <li>Leftover food and drinks to be disposed only in pantry bins</li>
        <li>Keep the area clean and tidy, put items back in original place</li>
        <li>Switch off lights and electronic devices after use</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Workstation</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Keep your workstation clean and tidy</li>
        <li>Cleaner will wipe all tables every morning</li>
        <li>Be wary - eating at workstation without cleaning crumbs can attract unwanted guests</li>
      </ul>

      <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
        <p class="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Remember</p>
        <ul class="space-y-1">
          <li>• Clean up immediately after using shared spaces</li>
          <li>• Label your food in the fridge</li>
          <li>• Report any maintenance issues to Office Manager</li>
        </ul>
      </div>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Operating Hours & Visitors Policy</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Office Operation: 9am - 6pm (weekdays)</li>
        <li>Visitor access: 9am - 5:30pm (weekdays)</li>
        <li>Submit visitor registration form 2 working days prior</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Health & Safety</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Practice good personal hygiene - wash/sanitize hands frequently</li>
        <li>Discard used tissues & masks immediately in bins with lids</li>
        <li>If sick and must visit, please wear a face mask</li>
        <li>If exposed to infectious disease, self-monitor and test</li>
        <li>Self-quarantine if tested positive</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Meeting Room Etiquette</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Follow specified check-in and check-out times</li>
        <li>Allow 30 min gap between meetings for cleaning</li>
        <li>Switch off electrical appliances and lights after use</li>
        <li>Eating in meeting rooms not encouraged</li>
        <li>Return all borrowed equipment to designated locations</li>
        <li>Book via Google Calendar</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">No Smoking Policy</h3>
      <ul class="list-disc list-inside mb-4">
        <li>The Social House is a "non-smoking" zone</li>
        <li>No vaping allowed in any indoor areas</li>
        <li>Designated smoking area: Ground floor at North lobby, near fountain</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">FAQs</h3>
      <div class="space-y-3 mb-4">
        <div>
          <p class="font-medium">Are there TVs/Projectors available?</p>
          <p class="text-sm">TVs in Las Vegas and Davos rooms. Projector in London room. Connect via HDMI cable.</p>
        </div>
        <div>
          <p class="font-medium">Can seating be rearranged?</p>
          <p class="text-sm">Best to keep arrangement as is. If adjusted, must return to original setup. Company liable for any damages.</p>
        </div>
        <div>
          <p class="font-medium">Can we bring food into meeting rooms?</p>
          <p class="text-sm">Yes, dining table at living room available. Clean up after meals. Food delivery to North lobby. Last trash collection at 4:30 PM.</p>
        </div>
      </div>
    `,
  },
  {
    title: "Workspace Layout",
    description:
      "Meeting rooms, work areas, and common spaces at 500 Social House.",
    image: "/workspace.webp",
    detailedContent: `
      <div class="mb-4 flex justify-center">
        <img src="/workspace-1.webp" alt="500 Social House workspace" class="w-full max-w-[400px] aspect-[4/3] object-cover rounded-lg shadow-md" />
      </div>

      <h3 class="font-semibold mb-2">Areas</h3>
      <ul class="list-disc list-inside mb-4">
        <li><strong>AI Builders area</strong> - Dedicated workspace for AI teams</li>
        <li><strong>500 Team area</strong> - Core team workspace</li>
        <li><strong>Common areas</strong> - Living space and communal dining</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Meeting Rooms (Bookable via Google Calendar)</h3>
      <ul class="list-disc list-inside mb-4">
        <li><strong>Abu Dhabi</strong> (4-5 pax) - Smart TV, HDMI</li>
        <li><strong>London</strong> (8-10 pax) - Whiteboard, monitor, projector, HDMI</li>
        <li><strong>Davos</strong> (10+ pax) - Whiteboard, Smart TV, HDMI</li>
      </ul>

      <div class="my-4"><hr class="border-gray-200 dark:border-gray-700" /></div>

      <h3 class="font-semibold mb-2">Coworking Areas</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Singapore, Bangkok, Tokyo, Seoul</li>
        <li>Cairo, Riyadh, Miami</li>
        <li>Green Area - Common area for collaboration</li>
        <li>Living Space - Relaxation and informal meetings</li>
        <li>Communal Dining - Shared meals and networking</li>
      </ul>

      <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
        <p class="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Tips</p>
        <ul class="space-y-1">
          <li>• Book meeting rooms via Google Calendar</li>
          <li>• Check room amenities before booking</li>
          <li>• Larger rooms for team meetings and presentations</li>
        </ul>
      </div>
    `,
  },
  {
    title: "Procedures",
    description:
      "Visitor registration and meeting room booking via Google Calendar.",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">Visitor Registration Process</h3>

      <div class="mb-4">
        <p class="font-medium mb-2">For 500 Team Member's Visitors:</p>
        <ul class="list-disc list-inside mb-3">
          <li>Fill up 500 Social House Visitor Registration form</li>
          <li>Submit at least 2 working days before meeting</li>
          <li>Book meeting room via Google Calendar</li>
          <li>500 team members must accompany their visitors</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">For Portfolio Companies:</p>
        <ul class="list-disc list-inside mb-3">
          <li>Submit 500 Social House Visitor Registration form</li>
          <li>At least 2 working days notice required</li>
          <li>Meeting room requests subject to availability</li>
          <li>Only for 500's investment-related activities</li>
        </ul>
      </div>

      <h3 class="font-semibold mb-2">What Happens Next?</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Information added to Nuveq portal by Office Manager</li>
        <li>Individual access links sent via email/WhatsApp</li>
        <li>Email subject: "Welcome to Nuveq Access!" (check SPAM folder)</li>
        <li>VIPs handled by GP/Partner's Executive Assistant</li>
        <li>AICB Building registration required at North Tower Lobby</li>
      </ul>

      <h3 class="font-semibold mb-2">Meeting Room Booking via Google Calendar</h3>

      <div class="mb-4">
        <p class="font-medium mb-2">How to Add Room Calendars:</p>
        <ol class="list-decimal list-inside mb-3">
          <li>Search "Other Calendar" and click "+" to add</li>
          <li>Browse Resources</li>
          <li>Click on "500 Social House"</li>
          <li>Tick to select all rooms to add to your calendar</li>
          <li>Use preview icon to view room availability</li>
        </ol>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">How to Book a Room:</p>
        <ol class="list-decimal list-inside mb-3">
          <li>Create a new event</li>
          <li>Click "add room or location"</li>
          <li>Browse and select your preferred room</li>
          <li>Check availability for your date/time</li>
          <li>Confirm booking</li>
        </ol>
      </div>

      <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg mb-4">
        <p class="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Tips</p>
        <ul class="space-y-1">
          <li>• Book early to secure preferred rooms</li>
          <li>• Cancel promptly if plans change</li>
          <li>• Check room amenities before booking</li>
        </ul>
      </div>

      <div class="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
        <p class="font-medium text-red-700 dark:text-red-300 mb-1">⚠️ Important</p>
        <ul class="space-y-1">
          <li>• Room unavailability means it's already booked</li>
          <li>• 2 working days advance notice required</li>
          <li>• Good hospitality expected from hosts</li>
        </ul>
      </div>
    `,
  },
  {
    title: "Emergency Response Plan",
    description:
      "Fire drill procedures, evacuation routes, and safety protocols.",
    image:
      "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=300&fit=crop",
    detailedContent: `
      <h3 class="font-semibold mb-2">Fire Drill Procedures</h3>

      <div class="mb-4">
        <p class="font-medium mb-2">Upon 1st Announcement:</p>
        <ul class="list-disc list-inside mb-3">
          <li>All team members on standby for 2nd announcement</li>
          <li>Be prepared for "Full Evacuation" or stand-down if false alarm</li>
          <li>Shut down all electrical appliances if possible</li>
          <li>Gather all personal valuables</li>
          <li>Ladies advised not to wear high heels (if spare shoes available)</li>
          <li>Do not run, hold handrails while descending stairs</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-2">Upon 2nd Announcement:</p>
        <ul class="list-disc list-inside mb-3">
          <li>Start evacuating the office immediately</li>
          <li>Proceed to nearest assembly point (North/South)</li>
          <li>Follow Standby Floor Warden to assembly point</li>
          <li>Main Floor Warden will be last to evacuate</li>
          <li>Ensure all office doors are secured</li>
        </ul>
      </div>

      <h3 class="font-semibold mb-2">Assembly Points</h3>
      <ul class="list-disc list-inside mb-4">
        <li>North Assembly Point - North Lobby area</li>
        <li>South Assembly Point - South Lobby area</li>
        <li>Follow emergency floor plan posted on Level 8</li>
      </ul>

      <h3 class="font-semibold mb-2">Emergency Exits</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Emergency exits marked in green</li>
        <li>Familiarize yourself with nearest exits</li>
        <li>Do not use elevators during emergencies</li>
        <li>Use stairwells for evacuation</li>
      </ul>

      <div class="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg mb-4">
        <p class="font-medium text-red-700 dark:text-red-300 mb-1">⚠️ Critical Safety Rules</p>
        <ul class="space-y-1">
          <li>• NEVER use elevators during fire emergencies</li>
          <li>• Do not re-enter building until all clear given</li>
          <li>• Follow Floor Warden instructions at all times</li>
          <li>• Stay calm and assist others if needed</li>
        </ul>
      </div>

      <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
        <p class="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Preparation Tips</p>
        <ul class="space-y-1">
          <li>• Know your nearest emergency exit</li>
          <li>• Keep emergency contact numbers saved</li>
          <li>• Participate in all fire drills</li>
          <li>• Report any blocked exits immediately</li>
        </ul>
      </div>
    `,
  },
  {
    title: "AICB Building Amenities",
    description:
      "Building facilities, library access, and wellness activities.",
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
    title: "Where to Eat",
    description:
      "Gigi Coffee, food courts, and delivery options near 500 Social House.",
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
          <li><strong>20% tenant discount</strong> - mention you're from 500</li>
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

      <div class="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg mb-4">
        <p class="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Delivery Tips</p>
        <ul class="space-y-1">
          <li>• Provide "AICB Building" as landmark</li>
          <li>• Include Level 8, 500 Social House in address</li>
          <li>• Add your contact number for riders</li>
          <li>• Specify North Lobby for pickup</li>
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
                      type: "spring",
                      stiffness: 200,
                      damping: 24,
                    }}
                  >
                    <MorphingDialogTrigger
                      style={{
                        borderRadius: "4px",
                      }}
                      className="border border-gray-200/60 bg-white dark:border-zinc-700/60 dark:bg-zinc-900"
                    >
                      <div className="flex items-center space-x-3 p-3">
                        <MorphingDialogImage
                          src={card.image}
                          alt={card.title}
                          className="h-8 w-8 object-cover object-top"
                          style={{
                            borderRadius: "4px",
                          }}
                        />
                        <div className="flex flex-col items-start justify-center space-y-0 flex-1">
                          <MorphingDialogTitle className="text-[10px] font-medium text-gray-900 dark:text-gray-100 sm:text-xs text-left">
                            {card.title}
                          </MorphingDialogTitle>
                          <MorphingDialogSubtitle className="text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs text-left">
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
                              <MorphingDialogTitle className="text-gray-900 dark:text-gray-100">
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
