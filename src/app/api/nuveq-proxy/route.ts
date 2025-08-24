import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Proxy received:", body);

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
    console.log("Nuveq response status:", response.status);
    console.log("Nuveq response:", responseText);

    // Try to parse as JSON, fallback to text
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    return NextResponse.json(
      {
        success: response.status === 201 || response.ok,
        status: response.status,
        data: responseData,
      },
      { status: response.status === 201 ? 201 : response.status }
    );
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
