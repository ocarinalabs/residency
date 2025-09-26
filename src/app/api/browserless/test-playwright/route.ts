import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check configuration
    const hasToken = !!process.env.BROWSERLESS_API_TOKEN;
    const hasUsername = !!process.env.NUVEQ_USERNAME;
    const hasPassword = !!process.env.NUVEQ_PASSWORD;

    return NextResponse.json({
      configuration: {
        browserlessToken: hasToken ? "Configured ✓" : "Missing ✗",
        nuveqUsername: hasUsername ? "Configured ✓" : "Missing ✗",
        nuveqPassword: hasPassword ? "Configured ✓" : "Missing ✗",
      },
      endpoints: {
        auth: "/api/browserless/auth",
        visitors: {
          today: "/api/browserless/visitors/today",
          future: "/api/browserless/visitors/future",
          pending: "/api/browserless/visitors/pending",
        },
        legacy: {
          bql: {
            today: "/api/browserless/today",
            future: "/api/browserless/future",
            pending: "/api/browserless/pending",
            all: "/api/browserless/all",
          },
        },
      },
      instructions: {
        1: "Test authentication: curl -X POST http://localhost:3000/api/browserless/auth",
        2: "Fetch today's visitors: curl http://localhost:3000/api/browserless/visitors/today",
        3: "All endpoints use Playwright connected to Browserless (not local browser)",
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
