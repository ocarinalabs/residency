import { mockRooms, Room } from "@/data/rooms";

export function getRoomsByCategory(category: Room["category"]): Room[] {
  return mockRooms.filter((room) => room.category === category);
}

export function getAvailableRooms(): Room[] {
  return mockRooms.filter((room) => room.available);
}

export function getRoomById(id: string): Room | undefined {
  return mockRooms.find((room) => room.id === id);
}

export async function fetchRooms(delay = 500): Promise<Room[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRooms), delay);
  });
}

export async function fetchRoomById(
  id: string,
  delay = 300
): Promise<Room | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getRoomById(id)), delay);
  });
}
