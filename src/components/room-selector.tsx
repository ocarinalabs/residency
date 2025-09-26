"use client";

import { useState } from "react";
import { RoomCard } from "./room-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROOMS, BOOKING_DURATIONS, getRoomById } from "@/data/room-constants";
import { Building2, Clock, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface RoomSelectorProps {
  selectedRoomId?: string;
  selectedDuration?: string;
  onRoomSelect: (roomId: string) => void;
  onDurationSelect: (duration: string) => void;
  className?: string;
}

export function RoomSelector({
  selectedRoomId,
  selectedDuration = "2",
  onRoomSelect,
  onDurationSelect,
  className,
}: RoomSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedRoom = selectedRoomId ? getRoomById(selectedRoomId) : null;

  const handleRoomSelect = (roomId: string) => {
    onRoomSelect(roomId);
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onRoomSelect("");
    onDurationSelect("2");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Room Selection */}
      <div className="space-y-2">
        <Label className="px-1">Room Booking</Label>

        {selectedRoom ? (
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">{selectedRoom.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedRoom.floor}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                Capacity: {selectedRoom.capacity}
              </Badge>
              {selectedRoom.amenities.slice(0, 2).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  Change Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Select a Meeting Room</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {ROOMS.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        onSelect={handleRoomSelect}
                        isSelected={room.id === selectedRoomId}
                        showSelectButton
                      />
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Select a meeting room
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Select a Meeting Room</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {ROOMS.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onSelect={handleRoomSelect}
                      isSelected={room.id === selectedRoomId}
                      showSelectButton
                    />
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Duration Selection - Only show if room is selected */}
      {selectedRoom && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            <Clock className="inline h-3 w-3 mr-1" />
            Booking Duration
          </label>
          <Select value={selectedDuration} onValueChange={onDurationSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_DURATIONS.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
