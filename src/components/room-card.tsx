"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomData } from "@/data/room-constants";
import { Users, MapPin, Check, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/cn";

interface RoomCardProps {
  room: RoomData;
  onSelect?: (roomId: string) => void;
  isSelected?: boolean;
  showSelectButton?: boolean;
  className?: string;
}

export function RoomCard({
  room,
  onSelect,
  isSelected = false,
  showSelectButton = false,
  className,
}: RoomCardProps) {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // All images including main and gallery
  const allImages = [room.images.main, ...room.images.gallery];

  const handleImageError = () => {
    setImageError(true);
  };

  // const nextImage = () => {
  //   setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  // };

  // const prevImage = () => {
  //   setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  // };

  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-lg transition-all duration-200",
        isSelected && "ring-2 ring-primary",
        className
      )}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-muted">
        {!imageError ? (
          <>
            <Image
              src={allImages[currentImageIndex]}
              alt={room.name}
              fill
              className="object-cover"
              onError={handleImageError}
              priority={false}
            />
            {/* Image navigation dots */}
            {allImages.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    )}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{room.name}</p>
            </div>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={room.available !== false ? "default" : "secondary"}
            className="gap-1"
          >
            {room.available !== false ? (
              <>
                <Check className="h-3 w-3" />
                Available
              </>
            ) : (
              <>
                <X className="h-3 w-3" />
                Occupied
              </>
            )}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{room.name}</h3>
            {room.floor && (
              <p className="text-sm text-muted-foreground">{room.floor}</p>
            )}
          </div>
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" />
            {room.capacity}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{room.description}</p>

        {/* Amenities */}
        {room.amenities.length > 0 && (
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
        )}

        {/* Select Button */}
        {showSelectButton && onSelect && (
          <Button
            onClick={() => onSelect(room.id)}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className="w-full"
          >
            {isSelected ? "Selected" : "Select Room"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
