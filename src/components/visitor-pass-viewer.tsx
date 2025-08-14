"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share2, Loader2 } from "lucide-react";

interface VisitorPassViewerProps {
  keyToken: string;
}

export function VisitorPassViewer({ keyToken }: VisitorPassViewerProps) {
  const [loading, setLoading] = useState(true);
  const [passData, setPassData] = useState<Record<string, unknown> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const passUrl = `https://nuveq.cloud/modules/visitors/visitor_pass.php?keyToken=${keyToken}`;

  useEffect(() => {
    // Try to fetch pass data
    fetchPassData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyToken]);

  const fetchPassData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch through a proxy or directly
      const response = await fetch(`/api/visitor-pass?token=${keyToken}`);
      if (!response.ok) {
        throw new Error("Failed to fetch pass");
      }
      const data = await response.json();
      setPassData(data);
    } catch (err) {
      console.error("Error fetching pass:", err);
      setError(
        "Unable to fetch pass data. Please try opening directly on mobile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Visitor Pass - 500 AI Residency",
          text: "My digital visitor pass for AICB",
          url: passUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(passUrl);
      alert("Pass URL copied to clipboard!");
    }
  };

  const handleDownload = () => {
    // Open in new window to trigger download
    window.open(passUrl, "_blank");
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading visitor pass...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="text-red-500">
            <QrCode className="h-12 w-12 mx-auto mb-2" />
            <p className="font-semibold">Pass Loading Issue</p>
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>

          <div className="pt-4 space-y-3">
            <Button
              onClick={() => window.open(passUrl, "_blank")}
              className="w-full"
            >
              Open Pass Directly
            </Button>
            <p className="text-xs text-muted-foreground">
              Tip: This link works best on mobile devices
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Pass Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Digital Visitor Pass</h2>
          <p className="text-muted-foreground">500 AI Residency at AICB</p>
        </div>

        {/* Pass Preview (if we have data) */}
        {passData ? (
          <div className="border rounded-lg p-4 bg-muted/20">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(passData, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <QrCode className="h-32 w-32 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Pass preview not available on desktop
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleShare} variant="outline" className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        {/* Mobile Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
          <p className="text-sm font-semibold mb-1">📱 Mobile Access:</p>
          <p className="text-xs text-muted-foreground">
            For the best experience, open this pass on your mobile device. The
            QR code and pass details will display correctly on mobile browsers.
          </p>
        </div>
      </div>
    </Card>
  );
}
