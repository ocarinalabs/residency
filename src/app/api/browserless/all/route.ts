import { NextResponse } from "next/server";
import { nuveqScraper } from "@/lib/browserless/scraper";

export const runtime = "nodejs"; // Required for Browserless API calls

export async function GET() {
  try {
    console.log("[Browserless] Fetching all visitors...");

    // Check if API token is configured
    if (!process.env.BROWSERLESS_API_TOKEN) {
      return NextResponse.json(
        {
          error: "Browserless API token not configured",
          message: "Please add BROWSERLESS_API_TOKEN to your .env.local file",
        },
        { status: 500 }
      );
    }

    // Check if Nuveq credentials are configured
    if (!process.env.NUVEQ_USERNAME || !process.env.NUVEQ_PASSWORD) {
      return NextResponse.json(
        {
          error: "Nuveq credentials not configured",
          message:
            "Please add NUVEQ_USERNAME and NUVEQ_PASSWORD to your .env.local file",
        },
        { status: 500 }
      );
    }

    // Get session info for debugging
    const sessionInfo = nuveqScraper.getSessionInfo();
    console.log("[Browserless] Session info:", sessionInfo);

    // Scrape all visitor types
    const allVisitors = await nuveqScraper.scrapeAllVisitors();

    // Get updated session info
    const updatedSessionInfo = nuveqScraper.getSessionInfo();

    return NextResponse.json({
      success: true,
      counts: {
        today: allVisitors.today.length,
        future: allVisitors.future.length,
        pending: allVisitors.pending.length,
        total:
          allVisitors.today.length +
          allVisitors.future.length +
          allVisitors.pending.length,
      },
      visitors: allVisitors,
      session: {
        ...updatedSessionInfo,
        expiresInMinutes: updatedSessionInfo.expiresIn
          ? Math.round(updatedSessionInfo.expiresIn / 60000)
          : undefined,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Browserless] Error fetching all visitors:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch visitors",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
