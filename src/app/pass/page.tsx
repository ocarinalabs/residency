"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function VisitorPassContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Get token from URL or use the default one
    const token =
      searchParams.get("token") || "x412Ac1QwRBLV4JB1yrx03PCAJu5jo7T5C7ZSn2Cb";
    // Redirect to the dynamic route
    router.push(`/pass/${token}`);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Card className="p-8">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Redirecting to visitor pass...
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function VisitorPassPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <Card className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </Card>
        </div>
      }
    >
      <VisitorPassContent />
    </Suspense>
  );
}
