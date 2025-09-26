import { NextResponse } from "next/server";
import { chromium } from "playwright-core";

async function authenticate() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/browserless/auth`,
    {
      method: "POST",
    }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Authentication failed");
  }

  return data.cookie;
}

export async function GET() {
  console.log("[Browserless] Fetching today's visitors...");

  try {
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

    // First authenticate and get cookies
    console.log("[Browserless] Authenticating...");
    const cookieString = await authenticate();

    // Connect to Browserless
    console.log("[Browserless] Connecting to Browserless...");
    const browser = await chromium.connectOverCDP(
      `wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`
    );

    try {
      // Parse cookies string into array
      const cookieArray = cookieString.split("; ").map((c: string) => {
        const [name, ...valueParts] = c.split("=");
        return {
          name,
          value: valueParts.join("="),
          domain: ".nuveq.cloud",
          path: "/",
        };
      });

      // Create context with cookies
      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      });

      // Add cookies to context
      await context.addCookies(cookieArray);

      const page = await context.newPage();

      // Navigate to today's visitors
      const url = "https://nuveq.cloud/visitor/todays-visitors";
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

      // Set pagination to "All" to show all visitors on one page
      console.log("[Browserless] Setting pagination to show all items...");
      try {
        // Click the items-per-page dropdown
        await page.waitForSelector(
          ".v-data-table-footer__items-per-page .v-select",
          { timeout: 5000 }
        );
        await page.click(".v-data-table-footer__items-per-page .v-select");

        // Wait for dropdown menu to appear and click "All" option
        await page.waitForSelector('.v-list-item:has-text("All")', {
          timeout: 3000,
        });
        await page.click('.v-list-item:has-text("All")');

        // Wait for table to reload with all data
        await page.waitForTimeout(1000); // Give the table time to refresh
        console.log("[Browserless] Pagination set to All");
      } catch (paginationError) {
        console.log(
          "[Browserless] Could not set pagination to All, continuing with default view"
        );
      }

      // Extract visitor data
      console.log("[Browserless] Extracting visitor data...");
      const visitors = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll("table tbody tr"));

        // Check if there's a 'no data' message
        if (rows.length === 1) {
          const firstRow = rows[0];
          if (
            firstRow.querySelector(".dataTables_empty") ||
            firstRow.textContent?.includes("No data available")
          ) {
            return [];
          }
        }

        return rows
          .map((row) => {
            const cells = Array.from(row.querySelectorAll("td"));

            // Skip rows with 'no data' message
            if (
              cells.length === 1 &&
              cells[0].textContent?.includes("No data")
            ) {
              return null;
            }

            // Parse the visitor data
            return {
              name: cells[0]?.textContent?.trim() || "",
              photo:
                (cells[1]?.querySelector("img") as HTMLImageElement)?.src || "",
              company: cells[2]?.textContent?.trim() || "",
              site: cells[3]?.textContent?.trim() || "",
              visitFrom: cells[4]?.textContent?.trim() || "",
              visitTill: cells[5]?.textContent?.trim() || "",
              visitorType: cells[6]?.textContent?.trim() || "",
              credential: cells[7]?.textContent?.trim() || "",
              invitedBy: cells[8]?.textContent?.trim() || "",
              vehicleNumber: cells[9]?.textContent?.trim() || "",
              reasonForVisit: cells[10]?.textContent?.trim() || "",
              approvedBy: cells[11]?.textContent?.trim() || "",
            };
          })
          .filter((visitor) => visitor !== null);
      });

      console.log(`[Browserless] Found ${visitors.length} visitors`);

      await browser.close();

      return NextResponse.json({
        success: true,
        count: visitors.length,
        visitors,
        timestamp: new Date().toISOString(),
      });
    } catch (innerError) {
      await browser.close();
      throw innerError;
    }
  } catch (error) {
    console.error("[Browserless] Error fetching visitors:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch visitors",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
