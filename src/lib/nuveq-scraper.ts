import { chromium, Browser, BrowserContext, Page } from "playwright";
import path from "path";
import fs from "fs";

const AUTH_STATE_PATH = path.join(process.cwd(), "auth-state.json");

export interface Visitor {
  id: number;
  name: string;
  company: string;
  site: string;
  visitFrom: string;
  visitTill: string;
  visitorType: string;
  credential: string;
  invitedBy: string;
  vehicleNumber: string;
  reasonForVisit: string;
  approvedBy: string;
  photo?: string;
}

export interface ScrapeResult {
  success: boolean;
  message: string;
  visitors: Visitor[];
  count: number;
  timestamp: string;
  debug?: {
    title: string;
    url: string;
    tableCount: number;
    bodyText: string;
  };
}

async function ensureAuthenticated(): Promise<boolean> {
  if (!fs.existsSync(AUTH_STATE_PATH)) {
    // Try to authenticate
    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/nuveq/auth`,
      {
        method: "POST",
      }
    );

    const authData = await authResponse.json();
    return authData.success;
  }
  return true;
}

export async function scrapeNuveqVisitors(
  endpoint: string
): Promise<ScrapeResult> {
  let browser: Browser | null = null;

  try {
    // Ensure we're authenticated
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      return {
        success: false,
        message: "Failed to authenticate with Nuveq",
        visitors: [],
        count: 0,
        timestamp: new Date().toISOString(),
      };
    }

    console.log(`Launching browser to fetch visitors from ${endpoint}...`);
    browser = await chromium.launch({ headless: true });

    // Load the saved auth state
    const context: BrowserContext = await browser.newContext({
      storageState: AUTH_STATE_PATH,
    });

    const page: Page = await context.newPage();

    // Navigate to the visitors page
    console.log(`Navigating to ${endpoint}...`);
    await page.goto(endpoint, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Try to wait for table
    try {
      await page.waitForSelector("table", { timeout: 5000 });
      console.log("Table found on page");
    } catch {
      console.log("No table found, checking for other content...");
    }

    // Extract visitor data from the page
    const visitors = await page.evaluate(() => {
      const visitorList: Visitor[] = [];

      // Look for the main table
      const tables = document.querySelectorAll("table");
      if (tables.length === 0) {
        console.log("No tables found on page");
        return visitorList;
      }

      // Process the first table with data
      for (const table of tables) {
        const rows = table.querySelectorAll("tbody tr");
        if (rows.length > 0) {
          rows.forEach((row, index) => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 8) {
              // Extract text from each cell
              const cellTexts = Array.from(cells).map(
                (cell) => (cell as HTMLElement).innerText?.trim() || ""
              );

              // Map fields based on Nuveq's table structure
              const visitor: Visitor = {
                id: index + 1,
                name: cellTexts[0] || "N/A",
                photo: "", // Photo column is usually empty or has an image
                company: cellTexts[2] || "N/A",
                site: cellTexts[3] || "N/A",
                visitFrom: cellTexts[4] || "N/A",
                visitTill: cellTexts[5] || "N/A",
                visitorType: cellTexts[6] || "N/A",
                credential: cellTexts[7] || "N/A",
                invitedBy: cellTexts[8] || "N/A",
                vehicleNumber: cellTexts[9] || "N/A",
                reasonForVisit: cellTexts[10] || "N/A",
                approvedBy: cellTexts[11] || "N/A",
              };

              // Only add if we have a name
              if (
                visitor.name &&
                visitor.name !== "N/A" &&
                visitor.name !== ""
              ) {
                visitorList.push(visitor);
              }
            }
          });
          break; // Use first table with data
        }
      }

      return visitorList;
    });

    // Get page info for debugging
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        tableCount: document.querySelectorAll("table").length,
        bodyText: document.body.innerText?.substring(0, 500) || "",
      };
    });

    console.log("Page info:", pageInfo);
    console.log(`Found ${visitors.length} visitors`);

    await browser.close();

    return {
      success: true,
      message:
        visitors.length > 0
          ? "Visitors fetched successfully"
          : "No visitors found",
      visitors,
      count: visitors.length,
      timestamp: new Date().toISOString(),
      debug: pageInfo,
    };
  } catch (error: unknown) {
    console.error("Error fetching visitors:", error);
    if (browser) {
      await browser.close();
    }
    return {
      success: false,
      message:
        "Error fetching visitors: " +
        (error instanceof Error ? error.message : "Unknown error"),
      visitors: [],
      count: 0,
      timestamp: new Date().toISOString(),
    };
  }
}
