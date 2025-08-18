"use client";

import { useState, useEffect, use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, CheckCircle2, Info, MapPin } from "lucide-react";
import { toast } from "sonner";
import CalendarIcon from "@/components/icons/calendar-icon";
import ClockIcon from "@/components/icons/clock-icon";
import UserIcon from "@/components/icons/user-icon";
import AccessIcon from "@/components/icons/access-icon";
import DoorEntryIcon from "@/components/icons/door-entry-icon";
import DoorExitIcon from "@/components/icons/door-exit-icon";
import { BGPattern } from "@/components/ui/bg-pattern";
import { useTheme } from "next-themes";

interface DoorControl {
  name: string;
  enterUrl: string;
  exitUrl: string;
}

export default function PassPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [doorControls, setDoorControls] = useState<DoorControl[]>([]);
  const [visitorInfo, setVisitorInfo] = useState<Record<string, string>>({});
  const [doorLoading, setDoorLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const passUrl = `https://nuveq.cloud/modules/visitors/visitor_pass.php?keyToken=${resolvedParams.token}`;

  useEffect(() => {
    fetchPassData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.token]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPassData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mobile-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: passUrl }),
      });

      const data = await response.json();
      if (data.html) {
        parseData(data.html);
      }
    } catch (error) {
      console.error("Error fetching pass:", error);
      toast.error("Failed to load visitor pass");
    } finally {
      setLoading(false);
    }
  };

  const parseData = (html: string) => {
    // Function to simplify door names
    const simplifyDoorName = (name: string): string => {
      // Remove parentheses and their contents for main door
      if (name.toLowerCase().includes("main door")) {
        return "Main Door";
      }
      // Rename emergency doors
      if (name.toLowerCase().includes("emergency door")) {
        return "Pantry Door (Emergency Exit)";
      }
      return name;
    };

    // Extract door controls
    const doors: DoorControl[] = [];
    const doorSections = html.split("Door Name:");

    doorSections.forEach((section) => {
      if (section.includes("Access for Enter")) {
        const nameMatch = section.match(/([^<]+)</);
        const enterMatch = section.match(
          /href="([^"]+)"[^>]*>Access for Enter/
        );
        const exitMatch = section.match(/href="([^"]+)"[^>]*>Access for Exit/);

        if (nameMatch && enterMatch && exitMatch) {
          doors.push({
            name: simplifyDoorName(nameMatch[1].trim()),
            enterUrl: enterMatch[1],
            exitUrl: exitMatch[1],
          });
        }
      }
    });
    setDoorControls(doors);

    // Extract visitor info
    const info: Record<string, string> = {};

    // Get visitor details from Detail tab
    const visitorMatch = html.match(
      /<div class="flex-grow-1 ms-3">([\s\S]*?)<\/div>/
    );
    if (visitorMatch) {
      const nameMatch = visitorMatch[1].match(/<h5[^>]*>([^<]+)<\/h5>/);
      if (nameMatch) info.name = nameMatch[1].trim();

      const pTags = visitorMatch[1].match(/<p[^>]*>([^<]*)<\/p>/g);
      if (pTags) {
        const values = pTags
          .map((p) => p.replace(/<[^>]+>/g, "").trim())
          .filter((v) => v);
        if (values[0]) info.icPassport = values[0];
        if (values[1]) info.email = values[1];
        if (values[2]) info.phone = values[2];
      }
    }

    // Get dates and times
    const startDateMatch = html.match(/Start Date:[^<]*<\/strong>([^<]+)/);
    const endDateMatch = html.match(/End Date:[^<]*<\/strong>([^<]+)/);
    const startTimeMatch = html.match(/Start Time:[^<]*<\/strong>([^<]+)/);
    const endTimeMatch = html.match(/End Time:[^<]*<\/strong>([^<]+)/);

    if (startDateMatch) info.startDate = startDateMatch[1].trim();
    if (endDateMatch) info.endDate = endDateMatch[1].trim();
    if (startTimeMatch) info.startTime = startTimeMatch[1].trim();
    if (endTimeMatch) info.endTime = endTimeMatch[1].trim();

    // Get QR code
    const qrMatch = html.match(/src="([^"]*qr[^"]+)"/i);
    if (qrMatch) info.qrCode = qrMatch[1];

    // Get inviter info
    const inviterSection = html.match(
      /<div[^>]*id="ex2-tabs-3"[^>]*>([\s\S]*?)(<\/div>\s*<\/div>\s*<!--|\s*<\/div>\s*<\/div>\s*<\/div>)/
    );
    if (inviterSection) {
      const fullContent = inviterSection[1];
      console.log("📋 Inviter section found, length:", fullContent.length);

      // Get company info from the first text block
      const companyMatch = fullContent.match(/<h5[^>]*>([^<]+)<\/h5>/);
      if (companyMatch) {
        info.company = companyMatch[1].trim();
        console.log("🏢 Company:", info.company);
      }

      // Get company location
      const locationMatch = fullContent.match(
        /<p[^>]*style="color: #2b2a2a;">([^<]+)<\/p>/
      );
      if (locationMatch) {
        info.companyLocation = locationMatch[1].trim();
        console.log("📍 Location:", info.companyLocation);
      }

      // Look for the inviter person after the hr tag
      // Split by hr to get the section after it
      const hrSplit = fullContent.split(/<hr[^>]*>/);
      console.log("📊 HR sections found:", hrSplit.length);

      if (hrSplit.length > 1) {
        const afterHr = hrSplit[hrSplit.length - 1]; // Get the last section after hr
        console.log(
          "📝 Content after HR (first 500 chars):",
          afterHr.substring(0, 500)
        );

        // Try multiple patterns to find the inviter info
        // Pattern 1: d-flex text-black
        let inviterDivMatch = afterHr.match(
          /<div[^>]*class="d-flex text-black"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/
        );

        // Pattern 2: If pattern 1 fails, try d-flex alone
        if (!inviterDivMatch) {
          console.log("⚠️ Pattern 1 failed, trying pattern 2...");
          inviterDivMatch = afterHr.match(
            /<div[^>]*class="d-flex[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/
          );
        }

        if (inviterDivMatch) {
          console.log("✅ Found inviter div");
          const inviterContent = inviterDivMatch[1];
          console.log(
            "📄 Inviter div content (first 300 chars):",
            inviterContent.substring(0, 300)
          );

          // Extract name from h5 tag
          const nameMatch = inviterContent.match(/<h5[^>]*>([^<]+)<\/h5>/);
          if (nameMatch) {
            info.inviterName = nameMatch[1].trim();
            console.log("👤 Inviter name:", info.inviterName);
          }

          // Extract all text content from the inviter div
          // Look for all p tags with content
          const pTags = inviterContent.match(/<p[^>]*>([^<]*)<\/p>/g);
          if (pTags) {
            console.log("📄 Found", pTags.length, "p tags in inviter content");
            const values = pTags
              .map((p) => {
                // Extract text between tags
                const match = p.match(/>([^<]+)</);
                return match ? match[1].trim() : "";
              })
              .filter((v) => v);

            console.log("📋 P tag values:", values);

            // Process the values
            values.forEach((value) => {
              if (value.includes("@")) {
                info.inviterEmail = value;
                console.log("📧 Inviter email:", info.inviterEmail);
              } else if (
                /^[0-9\+\-\s\(\)]+$/.test(value) &&
                value.length >= 7
              ) {
                info.inviterPhone = value;
                console.log("📱 Inviter phone:", info.inviterPhone);
              } else if (
                value &&
                !info.inviterPosition &&
                value !== info.inviterName
              ) {
                // Non-email, non-phone, non-name value is likely position
                info.inviterPosition = value;
                console.log("💼 Inviter position:", info.inviterPosition);
              }
            });
          }

          // If we still don't have all the info, try a more direct approach
          if (
            !info.inviterPosition ||
            !info.inviterEmail ||
            !info.inviterPhone
          ) {
            console.log("🔍 Trying alternative extraction...");
            // Look for the pattern after Adelyn Chan in the raw HTML
            const afterName = inviterContent.split(
              info.inviterName || "Adelyn Chan"
            )[1];
            if (afterName) {
              // Extract Management
              const mgmtMatch = afterName.match(/>([^<]*Management[^<]*)</i);
              if (mgmtMatch && !info.inviterPosition) {
                info.inviterPosition = mgmtMatch[1].trim();
                console.log("💼 Found position:", info.inviterPosition);
              }

              // Extract email
              const emailMatch = afterName.match(/>([^<]*@[^<]+)</);
              if (emailMatch && !info.inviterEmail) {
                info.inviterEmail = emailMatch[1].trim();
                console.log("📧 Found email:", info.inviterEmail);
              }

              // Extract phone
              const phoneMatch = afterName.match(/>([0-9\+\-\s\(\)]{7,})</);
              if (phoneMatch && !info.inviterPhone) {
                info.inviterPhone = phoneMatch[1].trim();
                console.log("📱 Found phone:", info.inviterPhone);
              }
            }
          }
        } else {
          console.log("❌ No inviter div found with any pattern");
          // Last resort: look for any h5 tag after hr that's not the company
          const allH5s = afterHr.match(/<h5[^>]*>([^<]+)<\/h5>/g);
          if (allH5s) {
            console.log("🔍 Found", allH5s.length, "h5 tags after HR");
            allH5s.forEach((h5, index) => {
              const content = h5.replace(/<[^>]+>/g, "").trim();
              console.log(`  H5[${index}]:`, content);
              // Skip if it's the company name we already found
              if (content && content !== info.company && !info.inviterName) {
                info.inviterName = content;
                console.log("👤 Using h5 as inviter name:", info.inviterName);
              }
            });
          }
        }
      } else {
        console.log("❌ No HR tag found in inviter section");
      }
    } else {
      console.log("❌ No inviter section found");
    }

    setVisitorInfo(info);
  };

  const triggerDoor = async (
    url: string,
    doorName: string,
    action: "enter" | "exit"
  ) => {
    setDoorLoading(`${doorName}-${action}`);

    try {
      // Open in hidden iframe
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>
            {action === "enter"
              ? "Entry access granted"
              : "Exit access granted"}
          </span>
        </div>
      );

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 3000);
    } catch (error) {
      console.error("Error triggering door:", error);
      toast.error("Failed to trigger door");
    } finally {
      setTimeout(() => setDoorLoading(null), 1000);
    }
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-background flex items-center justify-center">
        {/* Background pattern */}
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
        <div className="relative flex flex-col items-center space-y-4 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading residency pass...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background pattern */}
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
      <div className="relative max-w-4xl mx-auto p-6 space-y-6 z-10">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold">AI Residency Pass</h1>
        </div>

        {/* Door Controls Card */}
        {doorControls.length > 0 && (
          <Card className="p-6 ">
            <div className="flex items-center gap-3 mb-4">
              <AccessIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Door Controls</h2>
            </div>

            <div className="space-y-4">
              {[...doorControls].reverse().map((door) => (
                <div key={door.name} className="space-y-2">
                  <p className="font-medium">{door.name}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        triggerDoor(door.enterUrl, door.name, "enter")
                      }
                      disabled={doorLoading === `${door.name}-enter`}
                      className="flex-1 h-12"
                      size="lg"
                    >
                      {doorLoading === `${door.name}-enter` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <DoorEntryIcon className="mr-2 h-4 w-4" />
                          Enter
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() =>
                        triggerDoor(door.exitUrl, door.name, "exit")
                      }
                      disabled={doorLoading === `${door.name}-exit`}
                      variant="outline"
                      className="flex-1 h-12"
                      size="lg"
                    >
                      {doorLoading === `${door.name}-exit` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <DoorExitIcon className="mr-2 h-4 w-4" />
                          Exit
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Resident Info Card */}
        {visitorInfo.name && (
          <Card className="p-6 ">
            <div className="flex items-center gap-3 mb-4">
              <UserIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Resident Information</h2>
            </div>

            <div className="flex gap-6">
              {/* Left side - Resident details */}
              <div className="flex-1 grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{visitorInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      IC/Passport Number
                    </p>
                    <p className="font-medium">{visitorInfo.icPassport}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{visitorInfo.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{visitorInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <div className="flex items-center gap-1">
                      <p className="font-medium">
                        {visitorInfo.company || "N/A"}
                      </p>
                      {visitorInfo.company && (
                        <a
                          href="https://maps.app.goo.gl/NTVKNHo7HmUtAhvZ8"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex"
                        >
                          <MapPin className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approved by</p>
                    <div className="flex items-center gap-1">
                      <p className="font-medium">
                        {visitorInfo.inviterName || "Host"}
                      </p>
                      {(visitorInfo.inviterPosition ||
                        visitorInfo.inviterEmail ||
                        visitorInfo.inviterPhone) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0 hover:bg-transparent"
                            >
                              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              {visitorInfo.inviterPosition && (
                                <p className="text-sm">
                                  {visitorInfo.inviterPosition}
                                </p>
                              )}
                              {visitorInfo.inviterEmail && (
                                <p className="text-sm">
                                  {visitorInfo.inviterEmail}
                                </p>
                              )}
                              {visitorInfo.inviterPhone && (
                                <p className="text-sm">
                                  {visitorInfo.inviterPhone}
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - QR Code */}
              {visitorInfo.qrCode && (
                <div className="flex flex-col items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={visitorInfo.qrCode}
                    alt="Resident QR Code"
                    className="rounded-lg shadow-lg"
                    style={{ maxWidth: "180px" }}
                  />
                </div>
              )}
            </div>

            {/* Visit Schedule */}
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{visitorInfo.startDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {visitorInfo.startTime} - {visitorInfo.endTime}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
