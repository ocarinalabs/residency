import { NextResponse } from "next/server";
import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const AUTH_STATE_PATH = path.join(process.cwd(), "browserless-auth-state.json");

export async function POST(request: Request) {
  try {
    const { credential, visitorType } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: "Credential is required" },
        { status: 400 }
      );
    }

    console.log(
      `[Browserless] Deleting visitor with credential: ${credential}`
    );

    // Check if Browserless token is configured
    if (!process.env.BROWSERLESS_API_TOKEN) {
      return NextResponse.json(
        {
          error: "Browserless API token not configured",
          message: "Please add BROWSERLESS_API_TOKEN to your .env.local file",
        },
        { status: 500 }
      );
    }

    // Read auth state directly from file
    console.log("[Browserless] Reading auth state...");
    if (!fs.existsSync(AUTH_STATE_PATH)) {
      return NextResponse.json(
        {
          error: "Not authenticated",
          message: "Please login first via /api/browserless/auth",
        },
        { status: 401 }
      );
    }

    const authState = JSON.parse(fs.readFileSync(AUTH_STATE_PATH, "utf-8"));
    if (!authState.cookies || authState.cookies.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid auth state",
          message: "Please re-authenticate via /api/browserless/auth",
        },
        { status: 401 }
      );
    }

    // Connect to Browserless
    console.log("[Browserless] Connecting to Browserless...");
    const browser = await chromium.connectOverCDP(
      `wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`
    );

    try {
      // Use cookies directly from auth state
      const cookieArray = authState.cookies.map((c: any) => ({
        name: c.name,
        value: c.value,
        domain: c.domain || ".nuveq.cloud",
        path: c.path || "/",
      }));

      // Create context with cookies
      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      });

      // Add cookies to context
      await context.addCookies(cookieArray);

      const page = await context.newPage();

      // Determine which page to navigate to based on visitor type
      let url = "https://nuveq.cloud/visitor/todays-visitors";
      if (visitorType === "future") {
        url = "https://nuveq.cloud/visitor/future-visitors";
      } else if (visitorType === "pending") {
        url = "https://nuveq.cloud/visitor/pending-visitors";
      }

      console.log(`[Browserless] Navigating to ${url}...`);
      await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Check if we were redirected to login
      if (page.url().includes("/login")) {
        throw new Error("Session expired - authentication required");
      }

      // Wait for table to load
      console.log("[Browserless] Waiting for table...");
      await page.waitForSelector("table", { timeout: 10000 });

      // Set pagination to "All" to ensure visitor is visible
      console.log("[Browserless] Setting pagination to show all items...");
      try {
        await page.waitForSelector(
          ".v-data-table-footer__items-per-page .v-select",
          { timeout: 5000 }
        );
        await page.click(".v-data-table-footer__items-per-page .v-select");
        await page.waitForSelector('.v-list-item:has-text("All")', {
          timeout: 3000,
        });
        await page.click('.v-list-item:has-text("All")');
        await page.waitForTimeout(1000); // Give the table time to refresh
        console.log("[Browserless] Pagination set to All");
      } catch (paginationError) {
        console.log(
          "[Browserless] Could not set pagination to All, continuing with default view"
        );
      }

      // Find the visitor row by credential
      console.log(
        `[Browserless] Looking for visitor with credential ${credential}...`
      );
      const rowSelector = `tr:has(td:has-text("${credential}"))`;

      // Check if the visitor exists
      const visitorExists = (await page.locator(rowSelector).count()) > 0;

      if (!visitorExists) {
        throw new Error(`Visitor with credential ${credential} not found`);
      }

      // Click the delete icon in that row
      console.log("[Browserless] Clicking delete icon...");
      await page.click(`${rowSelector} .mdi-delete`);

      // Wait for confirmation dialog to appear
      console.log("[Browserless] Waiting for confirmation dialog...");
      await page.waitForSelector('.v-card:has-text("Delete visitor")', {
        timeout: 5000,
      });

      // Click Yes button to confirm deletion
      console.log("[Browserless] Confirming deletion...");
      await page.click('.v-card button:has-text("Yes")');

      // Wait a moment for the deletion to process
      await page.waitForTimeout(2000);

      console.log("[Browserless] Visitor deleted successfully");

      await browser.close();

      return NextResponse.json({
        success: true,
        message: "Visitor deleted successfully",
      });
    } catch (innerError) {
      await browser.close();
      throw innerError;
    }
  } catch (error) {
    console.error("[Browserless] Error deleting visitor:", error);

    return NextResponse.json(
      {
        error: "Failed to delete visitor",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
