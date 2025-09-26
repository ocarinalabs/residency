import { NextResponse } from "next/server";
import { scrapeNuveqVisitors } from "@/lib/nuveq/scraper";

export async function GET() {
  const result = await scrapeNuveqVisitors(
    "https://nuveq.cloud/visitor/todays-visitors"
  );

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
