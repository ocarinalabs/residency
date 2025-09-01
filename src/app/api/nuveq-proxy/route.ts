import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🎯 [PROXY] Incoming request:", body);
    console.log("🔍 [PROXY] Keytoken:", body.keytoken);
    console.log("📅 [PROXY] Visit dates:", {
      start: body.visitStart,
      end: body.visitEnd,
    });

    // Make the request to Nuveq API from server-side (no CORS)
    const response = await fetch(
      "https://nuveq.cloud/api/v2/visitor/register",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: "https://nuveq.cloud",
          Referer:
            "https://nuveq.cloud/visitor/register?keytoken=fK2FBZ9WWr4lpa3U2dq2",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
        },
        body: JSON.stringify(body),
      }
    );

    const responseText = await response.text();
    console.log("📡 [NUVEQ] Response status:", response.status);
    console.log(
      "📝 [NUVEQ] Response headers:",
      Object.fromEntries(response.headers.entries())
    );
    console.log("📄 [NUVEQ] Response body:", responseText);

    // Check for specific error patterns
    if (
      responseText.includes("credential") ||
      responseText.includes("authentication") ||
      responseText.includes("unauthorized")
    ) {
      console.error("🔐 [NUVEQ] CREDENTIAL/AUTH ERROR DETECTED IN RESPONSE");
    }
    if (
      responseText.includes("already registered") ||
      responseText.includes("duplicate")
    ) {
      console.warn("⚠️ [NUVEQ] DUPLICATE REGISTRATION DETECTED");
    }

    // Try to parse as JSON, fallback to text
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    const isSuccess = response.status === 201 || response.ok;
    console.log(
      isSuccess ? "✅ [PROXY] Success response" : "❌ [PROXY] Failed response"
    );

    return NextResponse.json(
      {
        success: isSuccess,
        status: response.status,
        data: responseData,
      },
      { status: response.status === 201 ? 201 : response.status }
    );
  } catch (error) {
    console.error("❌ [PROXY] Error:", error);
    console.error("📊 [PROXY] Error details:", {
      message: error instanceof Error ? error.message : "Unknown",
      stack: error instanceof Error ? error.stack : "No stack",
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
