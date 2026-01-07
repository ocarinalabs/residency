"use client";

import { Toggle } from "@residence/ui/components/shadcn/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Toggle
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="group size-9 border-0 data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted"
      onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      pressed={theme === "dark"}
      variant="default"
    >
      <Moon
        aria-hidden="true"
        className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
        size={16}
        strokeWidth={2}
      />
      <Sun
        aria-hidden="true"
        className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
        size={16}
        strokeWidth={2}
      />
    </Toggle>
  );
}
