"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Calendar24Props {
  onDateTimeChange?: (date: string, time: string) => void;
}

export function Calendar24({ onDateTimeChange }: Calendar24Props) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = React.useState<string>("09:00");

  // Set default date on mount
  React.useEffect(() => {
    const today = new Date();
    setDate(today);
    if (onDateTimeChange) {
      const formattedDate = today.toISOString().split("T")[0];
      onDateTimeChange(formattedDate, startTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && onDateTimeChange) {
      const formattedDate = newDate.toISOString().split("T")[0];
      onDateTimeChange(formattedDate, startTime);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setStartTime(newTime);
    if (date && onDateTimeChange) {
      const formattedDate = date.toISOString().split("T")[0];
      onDateTimeChange(formattedDate, newTime);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1">
          Date<span className="text-red-500 align-top text-xs">*</span>
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-full justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(newDate) => {
                handleDateChange(newDate);
                setOpen(false);
              }}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-from" className="px-1">
            From
          </Label>
          <Input
            type="time"
            id="time-from"
            value={startTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-to" className="px-1">
            To
          </Label>
          <Input
            type="time"
            id="time-to"
            value="23:59"
            disabled
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
}
