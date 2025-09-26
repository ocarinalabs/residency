import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST() {
  console.log("[Sync] Starting manual sync from Nuveq...");

  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const results = {
      today: { visitors: [], timestamp: null, count: 0 },
      future: { visitors: [], timestamp: null, count: 0 },
      pending: { visitors: [], timestamp: null, count: 0 },
      lastSync: null,
    };

    // Fetch all visitor types sequentially to avoid rate limiting
    console.log("[Sync] Fetching today's visitors...");
    const todayRes = await fetch(`${baseUrl}/api/browserless/visitors/today`);
    const todayData = await todayRes.json();

    if (todayData.success) {
      results.today = {
        visitors: todayData.visitors,
        timestamp: todayData.timestamp,
        count: todayData.count || todayData.visitors.length,
      };
    }

    console.log("[Sync] Fetching future visitors...");
    const futureRes = await fetch(`${baseUrl}/api/browserless/visitors/future`);
    const futureData = await futureRes.json();

    if (futureData.success) {
      results.future = {
        visitors: futureData.visitors,
        timestamp: futureData.timestamp,
        count: futureData.count || futureData.visitors.length,
      };
    }

    console.log("[Sync] Fetching pending visitors...");
    const pendingRes = await fetch(
      `${baseUrl}/api/browserless/visitors/pending`
    );
    const pendingData = await pendingRes.json();

    if (pendingData.success) {
      results.pending = {
        visitors: pendingData.visitors,
        timestamp: pendingData.timestamp,
        count: pendingData.count || pendingData.visitors.length,
      };
    }

    // Set last sync timestamp
    results.lastSync = new Date().toISOString();

    // Save to local cache file
    const cacheFilePath = path.join(
      process.cwd(),
      "src/data/visitors-cache.json"
    );

    await fs.writeFile(cacheFilePath, JSON.stringify(results, null, 2));

    console.log(
      `[Sync] Sync completed. Today: ${results.today.count}, Future: ${results.future.count}, Pending: ${results.pending.count}`
    );

    return NextResponse.json({
      success: true,
      message: "Data synced successfully",
      counts: {
        today: results.today.count,
        future: results.future.count,
        pending: results.pending.count,
      },
      lastSync: results.lastSync,
    });
  } catch (error) {
    console.error("[Sync] Error during sync:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Sync failed",
      },
      { status: 500 }
    );
  }
}
