"use client";

import { Room } from "@/lib/room-data";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Check, X, DollarSign, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RoomCardProps {
  room: Room;
  selected?: boolean;
  onSelect?: (room: Room) => void;
  compact?: boolean;
}

export function RoomCard({
  room,
  selected = false,
  onSelect,
  compact = false,
}: RoomCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const categoryColors = {
    meeting: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    conference:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    office: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    lounge:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  const categoryLabels = {
    meeting: "Meeting Room",
    conference: "Conference Hall",
    office: "Private Office",
    lounge: "Lounge Space",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 transform-gpu",
        "hover:shadow-xl hover:-translate-y-1",
        selected && "ring-2 ring-primary shadow-lg scale-[1.02]",
        !room.available && "opacity-60 hover:transform-none",
        onSelect && room.available && "cursor-pointer",
        "group"
      )}
      onClick={() => room.available && onSelect?.(room)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        )}
        <img
          src={room.image}
          alt={room.name}
          className={cn(
            "h-full w-full object-cover transition-all duration-500",
            isHovered && room.available && "scale-110 brightness-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {selected && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg animate-in fade-in zoom-in duration-300">
            <Check className="h-4 w-4" />
          </div>
        )}

        {!room.available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="destructive" className="text-sm shadow-lg">
              <X className="mr-1 h-3 w-3" />
              Unavailable
            </Badge>
          </div>
        )}

        {/* Quick action overlay on hover */}
        {room.available && onSelect && isHovered && !compact && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center animate-in slide-in-from-bottom duration-300">
            <Badge className="bg-white/90 text-black backdrop-blur-sm">
              <Sparkles className="mr-1 h-3 w-3" />
              Available Now
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className={cn("space-y-2", compact && "pb-2")}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{room.name}</h3>
          <Badge className={cn("text-xs", categoryColors[room.category])}>
            {categoryLabels[room.category]}
          </Badge>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 shrink-0" />
            <span className="whitespace-nowrap">Up to {room.capacity}</span>
          </div>
          {room.pricePerHour && (
            <div className="flex items-center gap-1 font-medium">
              <DollarSign className="h-3 w-3 shrink-0" />
              <span>{room.pricePerHour}/hr</span>
            </div>
          )}
        </div>
      </CardHeader>

      {!compact && (
        <>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {room.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {room.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{room.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>

          {onSelect && (
            <CardFooter>
              <Button
                className="w-full"
                variant={selected ? "default" : "outline"}
                disabled={!room.available}
              >
                {selected ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Selected
                  </>
                ) : (
                  "Select Room"
                )}
              </Button>
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}
