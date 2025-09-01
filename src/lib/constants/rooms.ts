// Room configuration constants and types
// Single source of truth for all room-related data

export const ROOM_CAPACITIES = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  XLARGE: 16,
} as const;

export const BOOKING_DURATIONS = [
  { value: "1", label: "1 Hour", hours: 1 },
  { value: "2", label: "2 Hours", hours: 2 },
  { value: "4", label: "4 Hours", hours: 4 },
  { value: "8", label: "Full Day", hours: 8 },
] as const;

export const ROOM_AMENITIES = {
  PROJECTOR: "Projector",
  WHITEBOARD: "Whiteboard",
  VIDEO_CONF: "Video Conference",
  AIR_CON: "Air Conditioning",
  TV_SCREEN: "TV Screen",
  SOUND_SYSTEM: "Sound System",
  COFFEE: "Coffee Machine",
  PHONE: "Conference Phone",
} as const;

export interface RoomImage {
  main: string;
  gallery: string[];
}

export interface RoomData {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  description: string;
  images: RoomImage;
  floor?: string;
  available?: boolean;
}

export type BookingDuration = (typeof BOOKING_DURATIONS)[number];
export type RoomCapacity =
  (typeof ROOM_CAPACITIES)[keyof typeof ROOM_CAPACITIES];

// Room data configuration
export const ROOMS: RoomData[] = [
  {
    id: "singapore",
    name: "Singapore Room",
    capacity: ROOM_CAPACITIES.MEDIUM,
    amenities: [
      ROOM_AMENITIES.PROJECTOR,
      ROOM_AMENITIES.WHITEBOARD,
      ROOM_AMENITIES.VIDEO_CONF,
      ROOM_AMENITIES.AIR_CON,
    ],
    description:
      "Modern meeting room with city-inspired design and state-of-the-art facilities",
    floor: "Level 2",
    images: {
      main: "/rooms/singapore/main.jpg",
      gallery: ["/rooms/singapore/view-1.jpg", "/rooms/singapore/view-2.jpg"],
    },
    available: true,
  },
  {
    id: "bangkok",
    name: "Bangkok Room",
    capacity: ROOM_CAPACITIES.SMALL,
    amenities: [
      ROOM_AMENITIES.WHITEBOARD,
      ROOM_AMENITIES.AIR_CON,
      ROOM_AMENITIES.TV_SCREEN,
    ],
    description:
      "Intimate meeting space perfect for focused discussions and small team sessions",
    floor: "Level 2",
    images: {
      main: "/rooms/bangkok/main.jpg",
      gallery: ["/rooms/bangkok/view-1.jpg", "/rooms/bangkok/view-2.jpg"],
    },
    available: true,
  },
  {
    id: "tokyo",
    name: "Tokyo Room",
    capacity: ROOM_CAPACITIES.LARGE,
    amenities: [
      ROOM_AMENITIES.PROJECTOR,
      ROOM_AMENITIES.WHITEBOARD,
      ROOM_AMENITIES.VIDEO_CONF,
      ROOM_AMENITIES.AIR_CON,
      ROOM_AMENITIES.SOUND_SYSTEM,
    ],
    description:
      "Spacious conference room with advanced presentation capabilities",
    floor: "Level 3",
    images: {
      main: "/rooms/tokyo/main.jpg",
      gallery: ["/rooms/tokyo/view-1.jpg", "/rooms/tokyo/view-2.jpg"],
    },
    available: true,
  },
  {
    id: "seoul",
    name: "Seoul Room",
    capacity: ROOM_CAPACITIES.MEDIUM,
    amenities: [
      ROOM_AMENITIES.PROJECTOR,
      ROOM_AMENITIES.WHITEBOARD,
      ROOM_AMENITIES.AIR_CON,
      ROOM_AMENITIES.COFFEE,
    ],
    description: "Dynamic workspace with modern Korean-inspired aesthetics",
    floor: "Level 3",
    images: {
      main: "/rooms/seoul/main.jpg",
      gallery: ["/rooms/seoul/view-1.jpg", "/rooms/seoul/view-2.jpg"],
    },
    available: true,
  },
  {
    id: "abu-dhabi",
    name: "Abu Dhabi Room",
    capacity: ROOM_CAPACITIES.XLARGE,
    amenities: [
      ROOM_AMENITIES.PROJECTOR,
      ROOM_AMENITIES.WHITEBOARD,
      ROOM_AMENITIES.VIDEO_CONF,
      ROOM_AMENITIES.AIR_CON,
      ROOM_AMENITIES.SOUND_SYSTEM,
      ROOM_AMENITIES.PHONE,
    ],
    description:
      "Executive boardroom with premium facilities for important meetings",
    floor: "Level 4",
    images: {
      main: "/rooms/abu-dhabi/main.jpg",
      gallery: ["/rooms/abu-dhabi/view-1.jpg", "/rooms/abu-dhabi/view-2.jpg"],
    },
    available: true,
  },
  {
    id: "cairo",
    name: "Cairo Room",
    capacity: ROOM_CAPACITIES.SMALL,
    amenities: [
      ROOM_AMENITIES.WHITEBOARD,
      ROOM_AMENITIES.AIR_CON,
      ROOM_AMENITIES.PHONE,
    ],
    description:
      "Cozy meeting room ideal for one-on-one meetings and interviews",
    floor: "Level 2",
    images: {
      main: "/rooms/cairo/main.jpg",
      gallery: ["/rooms/cairo/view-1.jpg", "/rooms/cairo/view-2.jpg"],
    },
    available: true,
  },
  {
    id: "riyadh",
    name: "Riyadh Room",
    capacity: ROOM_CAPACITIES.LARGE,
    amenities: [
      ROOM_AMENITIES.PROJECTOR,
      ROOM_AMENITIES.WHITEBOARD,
      ROOM_AMENITIES.VIDEO_CONF,
      ROOM_AMENITIES.AIR_CON,
      ROOM_AMENITIES.COFFEE,
    ],
    description: "Sophisticated meeting space with Arabian-inspired decor",
    floor: "Level 4",
    images: {
      main: "/rooms/riyadh/main.jpg",
      gallery: ["/rooms/riyadh/view-1.jpg", "/rooms/riyadh/view-2.jpg"],
    },
    available: true,
  },
  {
    id: "miami",
    name: "Miami Room",
    capacity: ROOM_CAPACITIES.MEDIUM,
    amenities: [
      ROOM_AMENITIES.TV_SCREEN,
      ROOM_AMENITIES.WHITEBOARD,
      ROOM_AMENITIES.AIR_CON,
      ROOM_AMENITIES.SOUND_SYSTEM,
    ],
    description: "Vibrant creative space with a relaxed atmosphere",
    floor: "Level 3",
    images: {
      main: "/rooms/miami/main.jpg",
      gallery: ["/rooms/miami/view-1.jpg", "/rooms/miami/view-2.jpg"],
    },
    available: true,
  },
  {
    id: "davos",
    name: "Davos Room",
    capacity: ROOM_CAPACITIES.XLARGE,
    amenities: [
      ROOM_AMENITIES.PROJECTOR,
      ROOM_AMENITIES.WHITEBOARD,
      ROOM_AMENITIES.VIDEO_CONF,
      ROOM_AMENITIES.AIR_CON,
      ROOM_AMENITIES.SOUND_SYSTEM,
      ROOM_AMENITIES.COFFEE,
      ROOM_AMENITIES.PHONE,
    ],
    description:
      "Premium conference facility for high-level strategic meetings",
    floor: "Level 5",
    images: {
      main: "/rooms/davos/main.jpg",
      gallery: ["/rooms/davos/view-1.jpg", "/rooms/davos/view-2.jpg"],
    },
    available: true,
  },
  {
    id: "london",
    name: "London Room",
    capacity: ROOM_CAPACITIES.LARGE,
    amenities: [
      ROOM_AMENITIES.PROJECTOR,
      ROOM_AMENITIES.WHITEBOARD,
      ROOM_AMENITIES.VIDEO_CONF,
      ROOM_AMENITIES.AIR_CON,
      ROOM_AMENITIES.PHONE,
    ],
    description: "Classic British-styled boardroom with modern technology",
    floor: "Level 5",
    images: {
      main: "/rooms/london/main.jpg",
      gallery: ["/rooms/london/view-1.jpg", "/rooms/london/view-2.jpg"],
    },
    available: true,
  },
];

// Helper functions for room operations
export const getRoomById = (id: string): RoomData | undefined => {
  return ROOMS.find((room) => room.id === id);
};

export const getRoomsByCapacity = (minCapacity: number): RoomData[] => {
  return ROOMS.filter((room) => room.capacity >= minCapacity);
};

export const getAvailableRooms = (): RoomData[] => {
  return ROOMS.filter((room) => room.available !== false);
};

export const getRoomsByFloor = (floor: string): RoomData[] => {
  return ROOMS.filter((room) => room.floor === floor);
};

// Get unique floors for navigation
export const getUniqueFloors = (): string[] => {
  const floors = ROOMS.map((room) => room.floor).filter(
    (floor): floor is string => floor !== undefined
  );
  return [...new Set(floors)].sort();
};
