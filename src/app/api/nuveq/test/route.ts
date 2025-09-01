import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if credentials are configured
    const hasCredentials = !!(
      process.env.NUVEQ_USERNAME && process.env.NUVEQ_PASSWORD
    );

    if (!hasCredentials) {
      return NextResponse.json({
        success: false,
        message: "Nuveq credentials not configured",
        instructions:
          "Please add NUVEQ_USERNAME and NUVEQ_PASSWORD to your .env.local file",
      });
    }

    // Test authentication with extended timeout for OTP entry
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/nuveq/auth`,
      {
        method: "POST",
        signal: controller.signal,
      }
    ).finally(() => clearTimeout(timeoutId));

    const authData = await authResponse.json();

    if (!authData.success) {
      return NextResponse.json({
        success: false,
        message: "Authentication test failed",
        details: authData.message,
        hint: "Check your NUVEQ_USERNAME and NUVEQ_PASSWORD in .env.local",
      });
    }

    // If auth successful, try to fetch visitors
    const visitorsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/nuveq/visitors/today`
    );
    const visitorsData = await visitorsResponse.json();

    return NextResponse.json({
      success: true,
      message: "Nuveq integration test successful",
      authentication: {
        status: "Connected",
        sessionActive: true,
      },
      visitors: {
        fetchSuccess: visitorsData.success,
        count: visitorsData.count || 0,
        message: visitorsData.message,
      },
      debug: visitorsData.debug || {},
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: "Test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
