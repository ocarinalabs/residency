"use client";

import { useState, useEffect, use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  DoorOpen,
  DoorClosed,
  User,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

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
  const [htmlContent, setHtmlContent] = useState("");
  const [doorControls, setDoorControls] = useState<DoorControl[]>([]);
  const [visitorInfo, setVisitorInfo] = useState<Record<string, string>>({});
  const [doorLoading, setDoorLoading] = useState<string | null>(null);
  const [showRawHtml, setShowRawHtml] = useState(false);

  const passUrl = `https://nuveq.cloud/modules/visitors/visitor_pass.php?keyToken=${resolvedParams.token}`;

  useEffect(() => {
    fetchPassData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.token]);

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
        setHtmlContent(data.html);
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
            name: nameMatch[1].trim(),
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
      /<div[^>]*id="ex2-tabs-3"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/
    );
    if (inviterSection) {
      const companyMatch = inviterSection[1].match(/<h5[^>]*>([^<]+)<\/h5>/);
      if (companyMatch) info.company = companyMatch[1].trim();

      const inviterPersonMatch = inviterSection[1].match(
        /<div class="flex-grow-1 ms-3">([\s\S]*?)<\/div>/
      );
      if (inviterPersonMatch) {
        const inviterNameMatch = inviterPersonMatch[1].match(
          /<h5[^>]*>([^<]+)<\/h5>/
        );
        if (inviterNameMatch) info.inviterName = inviterNameMatch[1].trim();

        const inviterEmail = inviterPersonMatch[1].match(/>([^<]*@[^<]+)</);
        if (inviterEmail) info.inviterEmail = inviterEmail[1].trim();
      }
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
            Door {action === "enter" ? "opened" : "unlocked"} for {action}
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

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Card className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading visitor pass...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Visitor Pass</h1>

        {/* Token Info */}
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-mono">Token: {resolvedParams.token}</p>
          <p className="text-sm font-mono">URL: {passUrl}</p>
        </div>

        {/* Visitor Info */}
        {visitorInfo.name && (
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Visitor Details
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Name:</strong> {visitorInfo.name}
              </div>
              <div>
                <strong>IC/Passport:</strong> {visitorInfo.icPassport}
              </div>
              <div>
                <strong>Email:</strong> {visitorInfo.email}
              </div>
              <div>
                <strong>Phone:</strong> {visitorInfo.phone}
              </div>
              <div>
                <strong>Company:</strong> {visitorInfo.company}
              </div>
              <div>
                <strong>Approved by:</strong> {visitorInfo.inviterName}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {visitorInfo.startDate}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {visitorInfo.startTime} - {visitorInfo.endTime}
              </div>
            </div>
          </div>
        )}

        {/* Door Controls */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <DoorOpen className="h-4 w-4" />
            Door Controls
          </h3>
          <div className="space-y-3">
            {doorControls.map((door) => (
              <div key={door.name}>
                <p className="text-sm font-medium mb-2">{door.name}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      triggerDoor(door.enterUrl, door.name, "enter")
                    }
                    disabled={doorLoading === `${door.name}-enter`}
                    variant="default"
                    className="flex-1"
                  >
                    {doorLoading === `${door.name}-enter` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <DoorOpen className="mr-2 h-4 w-4" />
                        Access for Enter
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => triggerDoor(door.exitUrl, door.name, "exit")}
                    disabled={doorLoading === `${door.name}-exit`}
                    variant="outline"
                    className="flex-1"
                  >
                    {doorLoading === `${door.name}-exit` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <DoorClosed className="mr-2 h-4 w-4" />
                        Access for Exit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code */}
        {visitorInfo.qrCode && (
          <div className="mb-6 p-4 border rounded-lg text-center">
            <h3 className="font-semibold mb-3">QR Code</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visitorInfo.qrCode}
              alt="Visitor QR Code"
              className="mx-auto"
              style={{ maxWidth: "200px" }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Scan for visitor details
            </p>
          </div>
        )}

        {/* Raw HTML Toggle */}
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => setShowRawHtml(!showRawHtml)}
          >
            {showRawHtml ? "Hide" : "Show"} Raw HTML
          </Button>

          {showRawHtml && (
            <div className="mt-4 p-4 bg-black text-green-400 rounded-lg overflow-auto max-h-96">
              <pre className="text-xs">{htmlContent}</pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
