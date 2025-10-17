"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { addDays } from "date-fns";

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
  const [endTime] = React.useState<string>("23:59");

  // Calculate days until next Thursday (demo day)
  const getNextThursday = (): number => {
    const today = new Date();
    const currentDay = today.getDay(); // 0=Sunday, 4=Thursday
    const thursday = 4;

    // If today is Thursday, return today (0 days)
    if (currentDay === thursday) {
      return 0;
    }

    // Calculate days until next Thursday
    let daysUntilThursday = thursday - currentDay;

    // If we're past Thursday (Fri-Sat), get next week's Thursday
    if (daysUntilThursday < 0) {
      daysUntilThursday += 7;
    }

    return daysUntilThursday;
  };

  // Helper function to check if a date matches the preset
  const isDateSelected = (presetDays: number): boolean => {
    if (!date) return false;
    const presetDate = addDays(new Date(), presetDays);
    return (
      date.getFullYear() === presetDate.getFullYear() &&
      date.getMonth() === presetDate.getMonth() &&
      date.getDate() === presetDate.getDate()
    );
  };

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
      <div className="flex flex-col gap-2">
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
        {/* Date presets */}
        <div className="flex gap-2">
          {[
            { label: "today", value: 0 },
            { label: "tomorrow", value: 1 },
            { label: "demo day", value: getNextThursday() },
          ].map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant={isDateSelected(preset.value) ? "default" : "outline"}
              size="sm"
              className="flex-1 font-mono"
              onClick={() => {
                const newDate = addDays(new Date(), preset.value);
                handleDateChange(newDate);
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="time-to" className="px-1">
            To
          </Label>
          <Input
            type="time"
            id="time-to"
            value={endTime}
            disabled={true}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
}
