import { NextResponse } from "next/server";
import { nuveqScraper } from "@/lib/browserless/scraper";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Check configuration
    const hasToken = !!process.env.BROWSERLESS_API_TOKEN;
    const hasUsername = !!process.env.NUVEQ_USERNAME;
    const hasPassword = !!process.env.NUVEQ_PASSWORD;

    // Get session info without creating a session
    const sessionInfo = nuveqScraper.getSessionInfo();

    return NextResponse.json({
      configuration: {
        browserlessToken: hasToken ? "Configured ✓" : "Missing ✗",
        nuveqUsername: hasUsername ? "Configured ✓" : "Missing ✗",
        nuveqPassword: hasPassword ? "Configured ✓" : "Missing ✗",
      },
      session: sessionInfo,
      endpoints: {
        today: "/api/browserless/today",
        future: "/api/browserless/future",
        pending: "/api/browserless/pending",
        all: "/api/browserless/all",
      },
      instructions: {
        1: "Get your Browserless API token from https://account.browserless.io/",
        2: "Add it to your .env.local file as BROWSERLESS_API_TOKEN",
        3: "Test by visiting one of the endpoints above",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
