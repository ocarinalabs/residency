import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    // Read the cached data
    const cacheFilePath = path.join(
      process.cwd(),
      "src/data/visitors-cache.json"
    );

    const cacheData = await fs.readFile(cacheFilePath, "utf-8");
    const cache = JSON.parse(cacheData);

    return NextResponse.json({
      success: true,
      data: cache,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Local Cache] Error reading cache:", error);

    // If file doesn't exist or is corrupted, return empty data
    return NextResponse.json({
      success: true,
      data: {
        today: { visitors: [], timestamp: null, count: 0 },
        future: { visitors: [], timestamp: null, count: 0 },
        pending: { visitors: [], timestamp: null, count: 0 },
        lastSync: null,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
