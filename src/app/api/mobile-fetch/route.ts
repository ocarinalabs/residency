import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    // Fetch with mobile user agent
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const html = await response.text();

    // Log some useful info
    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );
    console.log("HTML length:", html.length);
    console.log("First 500 chars:", html.substring(0, 500));

    // Try to extract useful data
    const extractData = (html: string) => {
      const data: Record<string, unknown> = {
        hasQR: html.includes("QR") || html.includes("qr"),
        hasDoor: html.includes("door") || html.includes("Door"),
        hasEmergency: html.includes("emergency") || html.includes("Emergency"),
        hasEntrance: html.includes("entrance") || html.includes("Entrance"),
        hasOpen: html.includes("open") || html.includes("Open"),
        hasButton: html.includes("<button") || html.includes('type="button"'),
        hasForm: html.includes("<form"),
        hasOnclick: html.includes("onclick="),
      };

      // Extract any JavaScript functions
      const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
      if (scriptMatches) {
        data.scripts = scriptMatches.map((s) => s.substring(0, 200) + "...");
      }

      // Extract any door-related onclick handlers
      const onclickMatches = html.match(/onclick="[^"]*door[^"]*"/gi);
      if (onclickMatches) {
        data.doorOnclicks = onclickMatches;
      }

      return data;
    };

    const analysis = extractData(html);
    console.log("Page analysis:", analysis);

    return NextResponse.json({
      html,
      analysis,
      length: html.length,
      status: response.status,
    });
  } catch (error) {
    console.error("Error fetching with mobile UA:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
