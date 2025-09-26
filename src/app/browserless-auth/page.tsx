"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function BrowserlessOTPPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  const startAuth = async () => {
    setIsLoading(true);
    setResult(null);
    setNeedsAuth(false);

    try {
      const response = await fetch("/api/browserless/auth", {
        method: "POST",
      });

      const data = await response.json();

      if (data.requiresOTP) {
        setNeedsAuth(true);
        setResult({
          success: false,
          message:
            "OTP required. Check your authenticator app and enter the 6-digit code below.",
        });
      } else if (data.success) {
        setResult({
          success: true,
          message: "Already authenticated! No OTP needed.",
        });
      } else {
        setResult({
          success: false,
          error: data.message || "Authentication failed",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to start authentication",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitOTP = async () => {
    if (otp.length !== 6) {
      setResult({
        success: false,
        error: "Please enter a 6-digit OTP code",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/browserless/auth/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message:
            "Authentication successful! You can now use the Browserless visitor endpoints.",
        });
        setNeedsAuth(false);
        setOtp("");
      } else {
        setResult({
          success: false,
          error: data.error || data.message || "OTP submission failed",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Browserless Authentication</CardTitle>
          <CardDescription>
            Authenticate with Nuveq through Browserless.io
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!needsAuth && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Click the button below to start authentication. If OTP is
                required, you&apos;ll be prompted to enter it.
              </p>
              <Button
                onClick={startAuth}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Authentication...
                  </>
                ) : (
                  "Start Authentication"
                )}
              </Button>
            </div>
          )}

          {needsAuth && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium">
                  Enter 6-digit OTP Code
                </label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-widest"
                />
                <p className="text-xs text-muted-foreground">
                  Check your authenticator app for the current code
                </p>
              </div>
              <Button
                onClick={submitOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting OTP...
                  </>
                ) : (
                  "Submit OTP"
                )}
              </Button>
            </div>
          )}

          {result && (
            <div
              className={`p-3 rounded-lg flex items-start space-x-2 ${
                result.success
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 mt-0.5" />
              )}
              <div className="flex-1 text-sm">
                {result.message || result.error}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <div className="space-y-1">
            <p>After successful authentication, you can access:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5">
              <li>/api/browserless/visitors/today</li>
              <li>/api/browserless/visitors/future</li>
              <li>/api/browserless/visitors/pending</li>
            </ul>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
