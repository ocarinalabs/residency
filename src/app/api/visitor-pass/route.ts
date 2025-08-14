import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  try {
    // Try to fetch the visitor pass from Nuveq
    const passUrl = `https://nuveq.cloud/modules/visitors/visitor_pass.php?keyToken=${token}`;

    // Add mobile user agent to potentially bypass desktop restrictions
    const response = await fetch(passUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Try to extract pass data from HTML
    // Look for common patterns in visitor pass pages
    const extractData = (html: string) => {
      const data: Record<string, unknown> = {};

      // Try to extract visitor name
      const nameMatch = html.match(/(?:Name|Visitor)[\s:]*([^<\n]+)/i);
      if (nameMatch) data.name = nameMatch[1].trim();

      // Try to extract date/time
      const dateMatch = html.match(/(?:Date|Visit)[\s:]*([^<\n]+)/i);
      if (dateMatch) data.visitDate = dateMatch[1].trim();

      // Try to extract location
      const locationMatch = html.match(/(?:Location|Site)[\s:]*([^<\n]+)/i);
      if (locationMatch) data.location = locationMatch[1].trim();

      // Check if it's actually a pass page
      data.isValidPass =
        html.includes("visitor") ||
        html.includes("pass") ||
        html.includes("QR");
      data.hasQRCode = html.includes("QR") || html.includes("qr");

      return data;
    };

    const passData = extractData(html);

    // If the page seems invalid, return the URL for direct access
    if (!passData.isValidPass) {
      return NextResponse.json(
        {
          error: "Pass may require mobile access",
          directUrl: passUrl,
          tip: "Open this URL on your mobile device for best results",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      ...passData,
      directUrl: passUrl,
      html: html.substring(0, 500), // Return first 500 chars for debugging
    });
  } catch (error) {
    console.error("Error fetching visitor pass:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch visitor pass",
        message: error instanceof Error ? error.message : "Unknown error",
        tip: "Try opening the pass directly on your mobile device",
      },
      { status: 500 }
    );
  }
}
