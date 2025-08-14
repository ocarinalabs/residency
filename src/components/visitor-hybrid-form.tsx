"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function VisitorHybridForm() {
  const [showIframe, setShowIframe] = useState(false);

  const handleOpenRegistration = () => {
    // Build URL with pre-filled parameters (if Nuveq supports it)
    const baseUrl = "https://nuveq.cloud/modules/visitors/regv.php";
    const params = new URLSearchParams({
      keytoken: "8zyCek2N9hS5u2jcS1aC4E6KzO0",
      // Add any supported pre-fill parameters here
    });

    // Open in new tab
    window.open(`${baseUrl}?${params}`, "_blank");
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Visitor Registration</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Register for your digital visitor pass
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleOpenRegistration} className="w-full" size="lg">
            Open Registration Form
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            onClick={() => setShowIframe(!showIframe)}
            variant="outline"
            className="w-full"
          >
            {showIframe ? "Hide" : "Show"} Embedded Form
          </Button>
        </div>

        {showIframe && (
          <div className="mt-4">
            <iframe
              src="https://nuveq.cloud/modules/visitors/regv.php?keytoken=8zyCek2N9hS5u2jcS1aC4E6KzO0"
              width="100%"
              height="600"
              className="border rounded-lg"
              title="Visitor Registration"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
