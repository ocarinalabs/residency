"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function VisitorPassPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const extractToken = (input: string): string | null => {
    // Try to parse as URL
    try {
      const url = new URL(input);
      const keyToken = url.searchParams.get("keyToken");
      if (keyToken) {
        return keyToken;
      }
    } catch {
      // Not a valid URL, check if it's a direct token
      // Token should be alphanumeric and at least 20 characters
      if (input.trim().length >= 20 && /^[a-zA-Z0-9]+$/.test(input.trim())) {
        return input.trim();
      }
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = extractToken(input);

    if (token) {
      router.push(`/pass/${token}`);
    } else {
      setError(
        "Invalid link or token. Please paste the complete link from your email."
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            Enter Your Visitor Pass Link
          </h1>
          <p className="text-muted-foreground">
            Paste the visitor pass link from your email to access your digital
            pass
          </p>
        </div>

        {/* Input Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="link" className="text-sm font-medium mb-3 block">
                Visitor Pass Link
              </label>
              <Input
                id="link"
                type="text"
                placeholder="https://nuveq.cloud/modules/visitors/visitor_pass.php?keyToken=..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError("");
                }}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg">
              View Pass
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Card>

        {/* Tutorial Card */}
        <Card className="p-6">
          <div className="flex items-start space-x-2 mb-4">
            <span className="text-primary text-lg">ⓘ</span>
            <h2 className="font-semibold text-lg">How to access your pass</h2>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="font-semibold text-primary">Step 1</span>
                <p className="text-sm text-muted-foreground">
                  Open your email and find the visitor pass button
                </p>
              </div>
              <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                <Image
                  src={isMobile ? "/email-3.webp" : "/email.webp"}
                  alt="Email with visitor pass button"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="font-semibold text-primary">Step 2</span>
                <p className="text-sm text-muted-foreground">
                  {isMobile
                    ? "Long press the button and select 'Copy Link'"
                    : "Right-click the button and select 'Copy Link'"}
                </p>
              </div>
              <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                <Image
                  src={isMobile ? "/email-4.webp" : "/email-2.webp"}
                  alt={
                    isMobile
                      ? "Long press to copy link on mobile"
                      : "Right-click to copy link on desktop"
                  }
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="font-semibold text-primary">Step 3</span>
                <p className="text-sm text-muted-foreground">
                  Paste the copied link in the field above
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
