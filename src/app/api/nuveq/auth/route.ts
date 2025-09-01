import { NextResponse } from "next/server";
import { chromium, BrowserContext } from "playwright";
import path from "path";
import fs from "fs";

// Paths for persistent auth
const AUTH_STATE_PATH = path.join(process.cwd(), "auth-state.json");
const USER_DATA_DIR = path.join(process.cwd(), ".playwright-auth");

// Session storage (in-memory cache)
let sessionCookies: string | null = null;
let sessionExpiry: Date | null = null;

async function extractCookiesFromContext(
  context: BrowserContext
): Promise<string> {
  const cookies = await context.cookies();
  return cookies.map((c) => `${c.name}=${c.value}`).join("; ");
}

async function testExistingSession(): Promise<boolean> {
  if (!fs.existsSync(AUTH_STATE_PATH)) {
    console.log("No saved auth state found");
    return false;
  }

  console.log("Testing existing auth state...");
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      storageState: AUTH_STATE_PATH,
    });

    const page = await context.newPage();

    // Try to access a protected page to test if we're logged in
    await page.goto("https://nuveq.cloud/visitor/todays-visitors", {
      waitUntil: "networkidle",
      timeout: 10000,
    });

    // Check if we were redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes("/login")) {
      console.log("Saved session is expired");
      await browser.close();
      return false;
    }

    console.log("Saved session is still valid!");

    // Extract and cache the cookies
    sessionCookies = await extractCookiesFromContext(context);
    sessionExpiry = new Date(Date.now() + 30 * 60 * 1000);

    await browser.close();
    return true;
  } catch (error) {
    console.log("Error testing saved session:", error);
    await browser.close();
    return false;
  }
}

export async function POST() {
  try {
    // Check if we have a valid session in memory
    if (sessionCookies && sessionExpiry && sessionExpiry > new Date()) {
      console.log("Using cached session from memory");
      return NextResponse.json({
        success: true,
        message: "Using existing session (memory cache)",
        cookie: sessionCookies,
      });
    }

    // Check if we have a saved auth state that's still valid
    const hasValidSession = await testExistingSession();
    if (hasValidSession && sessionCookies) {
      return NextResponse.json({
        success: true,
        message: "Using existing session (restored from disk)",
        cookie: sessionCookies,
      });
    }

    console.log("Starting fresh Playwright authentication...");

    // Use persistent context to maintain browser state
    const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
      headless: false, // Show browser for OTP entry if needed
      viewport: { width: 1280, height: 720 },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    try {
      const page = context.pages()[0] || (await context.newPage());

      console.log("Navigating to Nuveq login page...");
      await page.goto("https://nuveq.cloud/login");

      // Check if we're already logged in (persistent context might have kept us logged in)
      await page.waitForTimeout(2000); // Small delay to let any redirects happen
      if (!page.url().includes("/login")) {
        console.log("Already logged in via persistent context!");
        sessionCookies = await extractCookiesFromContext(context);
        sessionExpiry = new Date(Date.now() + 30 * 60 * 1000);

        // Save the state
        await context.storageState({ path: AUTH_STATE_PATH });
        await context.close();

        return NextResponse.json({
          success: true,
          message: "Already authenticated (persistent context)",
          cookie: sessionCookies,
        });
      }

      // Wait for the page to load
      await page.waitForLoadState("networkidle");

      console.log("Filling in email...");
      // Step 1: Enter email in the email field
      await page.fill("#input-18", process.env.NUVEQ_USERNAME || "");

      // Check "Stay signed in" checkbox
      try {
        await page.locator("#input-21").click({ force: true });
        console.log('Checked "Stay signed in"');
      } catch {
        console.log('Skipping "Stay signed in" checkbox');
      }

      console.log("Submitting email form...");
      await page.click('button[type="submit"]');

      // Step 2: Wait for password field to appear
      console.log("Waiting for password field...");
      await page.waitForSelector('input[type="password"]', {
        timeout: 5000,
        state: "visible",
      });

      console.log("Filling in password...");
      await page.fill(
        'input[type="password"]',
        process.env.NUVEQ_PASSWORD || ""
      );

      console.log("Submitting password form...");
      await page.click('button[type="submit"]');

      // Check for OTP requirement
      console.log("Checking for OTP requirement...");
      await page.waitForTimeout(3000); // Wait a bit to see what happens

      // Look for common OTP input patterns
      const otpSelectors = [
        'input[type="text"][maxlength="6"]',
        'input[type="number"][maxlength="6"]',
        'input[placeholder*="OTP"]',
        'input[placeholder*="code"]',
        'input[placeholder*="Code"]',
        'input[name*="otp"]',
        'input[name*="code"]',
      ];

      let otpInput = null;
      for (const selector of otpSelectors) {
        otpInput = await page.$(selector);
        if (otpInput) {
          console.log(`Found OTP input with selector: ${selector}`);
          break;
        }
      }

      if (otpInput) {
        console.log(
          "\n⚠️  OTP REQUIRED - Please enter the OTP code in the browser window"
        );
        console.log("📱 Check your authenticator app or email for the code");
        console.log("⏰ Waiting up to 5 minutes for you to enter the OTP...\n");

        // Wait for navigation after OTP entry (user will manually enter it)
        await page
          .waitForNavigation({
            timeout: 300000, // 5 minutes
            waitUntil: "networkidle",
          })
          .catch(async () => {
            // Check if we're still on a login-related page
            const currentUrl = page.url();
            if (
              currentUrl.includes("/login") ||
              currentUrl.includes("/otp") ||
              currentUrl.includes("/verify")
            ) {
              throw new Error("OTP entry timeout or failed");
            }
            console.log("Navigation completed after OTP");
          });
      } else {
        // No OTP required, wait for normal navigation
        console.log("No OTP required, waiting for navigation...");
        await page
          .waitForNavigation({
            waitUntil: "networkidle",
            timeout: 10000,
          })
          .catch(async () => {
            const currentUrl = page.url();
            console.log("Current URL after login:", currentUrl);
            if (!currentUrl.includes("/login")) {
              console.log("Login appears successful");
            } else {
              throw new Error("Login failed - still on login page");
            }
          });
      }

      // Extract cookies from the browser context
      const cookies = await context.cookies();
      console.log(`Retrieved ${cookies.length} cookies`);

      // Convert cookies to string format
      sessionCookies = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
      sessionExpiry = new Date(Date.now() + 30 * 60 * 1000);

      // Save the browser state for future use
      console.log("Saving authentication state...");
      await context.storageState({ path: AUTH_STATE_PATH });

      // Close the context
      await context.close();

      return NextResponse.json({
        success: true,
        message: otpInput
          ? "Authentication successful (with OTP)"
          : "Authentication successful",
        cookie: sessionCookies,
        cookieCount: cookies.length,
        expiresAt: sessionExpiry.toISOString(),
        stateSaved: true,
      });
    } catch (innerError: unknown) {
      // Make sure to close context on error
      await context.close();
      throw innerError;
    }
  } catch (error: unknown) {
    console.error("Nuveq auth error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
        error: errorMessage,
        hint: errorMessage.includes("OTP")
          ? "OTP entry may have timed out. Please try again."
          : undefined,
      },
      { status: 401 }
    );
  }
}

// Export function to get current session (for use by other API routes)
// Commented out as it's not a valid Next.js Route export
// export async function getSession() {
//   if (sessionCookies && sessionExpiry && sessionExpiry > new Date()) {
//     return sessionCookies;
//   }
//
//   // Try to re-authenticate
//   const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/nuveq/auth`, {
//     method: 'POST'
//   });
//
//   const data = await response.json();
//
//   if (data.success && data.cookie) {
//     return data.cookie;
//   }
//
//   throw new Error('Failed to authenticate with Nuveq');
// }
