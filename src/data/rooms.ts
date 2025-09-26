export interface Room {
  id: string;
  name: string;
  category: "meeting" | "conference" | "office" | "lounge";
  capacity: number;
  image: string;
  amenities: string[];
  description: string;
  available: boolean;
  pricePerHour?: number;
}

export const mockRooms: Room[] = [
  {
    id: "room-1",
    name: "Executive Boardroom",
    category: "conference",
    capacity: 20,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    amenities: [
      "Projector",
      "Whiteboard",
      "Video Conference",
      "Coffee Station",
    ],
    description:
      "Premium boardroom with panoramic city views, perfect for executive meetings",
    available: true,
    pricePerHour: 150,
  },
  {
    id: "room-2",
    name: "Innovation Lab",
    category: "meeting",
    capacity: 8,
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    amenities: [
      "Smart Board",
      "High-Speed WiFi",
      "Brainstorming Tools",
      "Standing Desks",
    ],
    description:
      "Creative space designed for brainstorming and collaborative work",
    available: true,
    pricePerHour: 80,
  },
  {
    id: "room-3",
    name: "Private Office Suite",
    category: "office",
    capacity: 4,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    amenities: [
      "Private Entrance",
      "Lounge Area",
      "Mini Fridge",
      "Ergonomic Furniture",
    ],
    description:
      "Quiet private office ideal for focused work or confidential meetings",
    available: true,
    pricePerHour: 60,
  },
  {
    id: "room-4",
    name: "Sky Lounge",
    category: "lounge",
    capacity: 30,
    image:
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80",
    amenities: [
      "Bar Service",
      "Outdoor Terrace",
      "AV System",
      "Casual Seating",
    ],
    description:
      "Relaxed atmosphere for informal meetings and networking events",
    available: true,
    pricePerHour: 200,
  },
  {
    id: "room-5",
    name: "Focus Pod",
    category: "office",
    capacity: 2,
    image:
      "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800&q=80",
    amenities: [
      "Sound Proof",
      "Adjustable Lighting",
      "Phone Booth",
      "USB Charging",
    ],
    description: "Compact pod for private calls and focused individual work",
    available: true,
    pricePerHour: 30,
  },
  {
    id: "room-6",
    name: "Training Center",
    category: "conference",
    capacity: 50,
    image:
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80",
    amenities: [
      "Multiple Screens",
      "PA System",
      "Recording Equipment",
      "Breakout Areas",
    ],
    description:
      "Large venue equipped for workshops, training sessions, and presentations",
    available: false,
    pricePerHour: 250,
  },
  {
    id: "room-7",
    name: "Zen Meeting Room",
    category: "meeting",
    capacity: 6,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
    amenities: ["Natural Light", "Plants", "Meditation Corner", "Air Purifier"],
    description:
      "Calming environment with biophilic design for mindful meetings",
    available: true,
    pricePerHour: 70,
  },
  {
    id: "room-8",
    name: "Tech Hub",
    category: "meeting",
    capacity: 12,
    image:
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80",
    amenities: ["Multiple Monitors", "Dev Tools", "3D Printer", "VR Equipment"],
    description:
      "High-tech meeting space for product demos and technical discussions",
    available: true,
    pricePerHour: 120,
  },
];
