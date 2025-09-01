import { NextRequest, NextResponse } from "next/server";
import { chromium, Browser, BrowserContext, Page } from "playwright";
import path from "path";
import fs from "fs";

const AUTH_STATE_PATH = path.join(process.cwd(), "auth-state.json");

export async function POST(request: NextRequest) {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    const { credential, name } = await request.json();

    if (!credential && !name) {
      return NextResponse.json(
        { success: false, message: "Credential or name is required" },
        { status: 400 }
      );
    }

    // Check if authenticated
    if (!fs.existsSync(AUTH_STATE_PATH)) {
      return NextResponse.json(
        { success: false, message: "Not authenticated with Nuveq" },
        { status: 401 }
      );
    }

    console.log(`Approving visitor: ${name || credential}`);

    // Launch browser in headless mode
    browser = await chromium.launch({ headless: true });

    // Load the saved auth state
    context = await browser.newContext({
      storageState: AUTH_STATE_PATH,
    });

    page = await context.newPage();

    // Navigate to pending visitors page
    console.log("Navigating to pending visitors page...");
    await page.goto("https://nuveq.cloud/visitor/pending-visitors", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Wait for table to load
    console.log("Waiting for table to load...");
    await page.waitForSelector("table", { timeout: 10000 });

    // Add a small delay to ensure all content is loaded
    await page.waitForTimeout(2000);

    // Try to find the visitor row by name first, then by credential
    let rowLocator;

    if (name) {
      console.log(`Looking for visitor by name: ${name}`);
      rowLocator = page.locator(`tr:has-text("${name}")`);

      if ((await rowLocator.count()) === 0 && credential) {
        console.log(`Name not found, trying credential: ${credential}`);
        rowLocator = page.locator(`tr:has-text("${credential}")`);
      }
    } else {
      console.log(`Looking for visitor by credential: ${credential}`);
      rowLocator = page.locator(`tr:has-text("${credential}")`);
    }

    const rowCount = await rowLocator.count();
    if (rowCount === 0) {
      console.log("Visitor not found. Page content:");
      console.log(await page.content());

      return NextResponse.json(
        { success: false, message: "Visitor not found in pending list" },
        { status: 404 }
      );
    }

    console.log(`Found ${rowCount} matching row(s)`);

    // Click the Approve button in that row
    // Based on the actual HTML, the approve button has class "bg-success"
    const approveButton = rowLocator.locator("button.bg-success").first();

    // Check if button exists
    if ((await approveButton.count()) === 0) {
      console.log("Approve button not found. Available buttons:");
      const buttons = await rowLocator.locator("button, a").all();
      for (const btn of buttons) {
        console.log(await btn.textContent());
      }

      return NextResponse.json(
        {
          success: false,
          message: "Approve button not found for this visitor",
        },
        { status: 404 }
      );
    }

    console.log("Clicking approve button...");
    await approveButton.click();

    // Wait for any confirmation dialog or page update
    await page.waitForTimeout(2000);

    // Check for confirmation dialog and click OK if present
    const confirmButton = page.locator(
      'button:has-text("OK"), button:has-text("Confirm"), button:has-text("Yes"), button.swal2-confirm'
    );
    if ((await confirmButton.count()) > 0) {
      console.log("Confirming approval...");
      await confirmButton.click();
      await page.waitForTimeout(2000);
    }

    await browser.close();

    return NextResponse.json({
      success: true,
      message: `Visitor ${name || credential} approved successfully`,
    });
  } catch (error) {
    console.error("Error approving visitor:", error);

    if (browser) {
      await browser.close();
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to approve visitor",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
