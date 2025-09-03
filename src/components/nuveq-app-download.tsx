"use client";

import { QrCode } from "@ark-ui/react/qr-code";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import GetOnApple from "./get-on-apple";
import GetOnGoogle from "./get-on-google";

export function NuveqAppDownload() {
  const iosAppUrl =
    "https://apps.apple.com/my/app/nuveq-mobile-access/id6504588391";
  const androidAppUrl =
    "https://play.google.com/store/apps/details?id=cloud.nuveq.mobile_access&pcampaignid=web_share";

  return (
    <Card className="mb-6 border max-w-2xl mx-auto bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">For New Visitors</CardTitle>
        </div>
        <CardDescription className="mt-2">
          If you&apos;re new to 500 Social House, download the Nuveq app to get
          entry access. Already have a Nuveq account? Skip this step and proceed
          to registration below. A Nuveq account is required to register as a
          visitor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          {/* iOS QR Code */}
          <div className="flex flex-col items-center space-y-2">
            <QrCode.Root
              value={iosAppUrl}
              className="flex items-center justify-center"
            >
              <QrCode.Frame className="w-32 h-32">
                <QrCode.Pattern className="fill-black dark:fill-white" />
              </QrCode.Frame>
            </QrCode.Root>
            <Link href={iosAppUrl} target="_blank" rel="noopener noreferrer">
              <GetOnApple className="h-10" />
            </Link>
          </div>

          {/* Android QR Code */}
          <div className="flex flex-col items-center space-y-2">
            <QrCode.Root
              value={androidAppUrl}
              className="flex items-center justify-center"
            >
              <QrCode.Frame className="w-32 h-32">
                <QrCode.Pattern className="fill-black dark:fill-white" />
              </QrCode.Frame>
            </QrCode.Root>
            <Link
              href={androidAppUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GetOnGoogle className="h-10" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
