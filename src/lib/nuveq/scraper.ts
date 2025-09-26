import { chromium, Browser, BrowserContext, Page } from "playwright";
import fs from "fs";
import { AUTH_CONFIG, TIMEOUTS } from "./constants";

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
  if (!fs.existsSync(AUTH_CONFIG.STATE_PATH)) {
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

async function launchBrowser(): Promise<Browser> {
  console.log("Launching browser...");
  return await chromium.launch({ headless: true });
}

async function createAuthenticatedContext(
  browser: Browser
): Promise<BrowserContext> {
  return await browser.newContext({
    storageState: AUTH_CONFIG.STATE_PATH,
  });
}

async function navigateToPage(page: Page, endpoint: string): Promise<void> {
  console.log(`Navigating to ${endpoint}...`);
  await page.goto(endpoint, {
    waitUntil: "networkidle",
    timeout: TIMEOUTS.NAVIGATION_MS,
  });

  await page.waitForTimeout(TIMEOUTS.PAGE_LOAD_MS);

  try {
    await page.waitForSelector("table", { timeout: TIMEOUTS.TABLE_WAIT_MS });
    console.log("Table found on page");
  } catch {
    console.log("No table found, checking for other content...");
  }
}

async function extractVisitors(page: Page): Promise<Visitor[]> {
  return await page.evaluate(() => {
    const visitorList: Visitor[] = [];
    const tables = document.querySelectorAll("table");

    if (tables.length === 0) {
      console.log("No tables found on page");
      return visitorList;
    }

    for (const table of tables) {
      const rows = table.querySelectorAll("tbody tr");
      if (rows.length > 0) {
        rows.forEach((row, index) => {
          const cells = Array.from(row.querySelectorAll("td")) as HTMLElement[];
          if (cells.length >= 8) {
            const cellTexts = cells.map((cell) => cell.innerText?.trim() || "");

            const visitor: Visitor = {
              id: index + 1,
              name: cellTexts[0] || "N/A",
              photo: "",
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

            if (visitor.name && visitor.name !== "N/A" && visitor.name !== "") {
              visitorList.push(visitor);
            }
          }
        });
        break;
      }
    }

    return visitorList;
  });
}

async function getPageDebugInfo(page: Page) {
  return await page.evaluate(() => {
    return {
      title: document.title,
      url: window.location.href,
      tableCount: document.querySelectorAll("table").length,
      bodyText: document.body.innerText?.substring(0, 500) || "",
    };
  });
}

export async function scrapeNuveqVisitors(
  endpoint: string
): Promise<ScrapeResult> {
  let browser: Browser | null = null;

  try {
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
    browser = await launchBrowser();
    const context = await createAuthenticatedContext(browser);
    const page = await context.newPage();

    await navigateToPage(page, endpoint);
    const visitors = await extractVisitors(page);
    const pageInfo = await getPageDebugInfo(page);

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
