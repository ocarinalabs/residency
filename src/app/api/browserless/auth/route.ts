import { NextResponse } from "next/server";
import { chromium, BrowserContext } from "playwright-core";
import path from "path";
import fs from "fs";

declare global {
  var browserlessAuthBrowser: unknown;
  var browserlessAuthPage: unknown;
}

// Paths for persistent auth (separate from local Playwright)
const AUTH_STATE_PATH = path.join(process.cwd(), "browserless-auth-state.json");

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
    console.log("[Browserless] No saved auth state found");
    return false;
  }

  console.log("[Browserless] Found saved auth state, checking expiry...");

  try {
    // Read the saved auth state
    const authState = JSON.parse(fs.readFileSync(AUTH_STATE_PATH, "utf-8"));

    // Check if cookies exist and are not expired
    if (authState.cookies && authState.cookies.length > 0) {
      // Check if any cookie is expired
      const now = Date.now() / 1000; // Convert to seconds
      const hasValidCookies = authState.cookies.some(
        (cookie: { expires: number }) =>
          cookie.expires === -1 || cookie.expires > now
      );

      if (hasValidCookies) {
        console.log(
          "[Browserless] Saved session is still valid (cookies not expired)!"
        );

        // Extract and cache the cookies
        sessionCookies = authState.cookies
          .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
          .join("; ");
        sessionExpiry = new Date(Date.now() + 30 * 60 * 1000);

        return true;
      } else {
        console.log("[Browserless] Saved session cookies are expired");
        return false;
      }
    }

    return false;
  } catch (error) {
    console.log("[Browserless] Error reading saved session:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Get OTP from request body if provided
    let otpCode: string | undefined;
    try {
      const body = await request.json();
      otpCode = body.otp;
    } catch {
      // No body provided, that's fine
    }
    // Check if Browserless token is configured
    if (!process.env.BROWSERLESS_API_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          message: "Browserless API token not configured",
        },
        { status: 500 }
      );
    }

    // Check if we have a valid session in memory
    if (sessionCookies && sessionExpiry && sessionExpiry > new Date()) {
      console.log("[Browserless] Using cached session from memory");
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

    console.log("[Browserless] Starting fresh authentication...");

    // Connect to Browserless
    const browser = await chromium.connectOverCDP(
      `wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}&headless=false`
    );

    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    try {
      const page = await context.newPage();

      console.log("[Browserless] Navigating to Nuveq login page...");
      await page.goto("https://nuveq.cloud/login", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Check if we're already logged in
      await page.waitForTimeout(2000);
      if (!page.url().includes("/login")) {
        console.log("[Browserless] Already logged in!");
        sessionCookies = await extractCookiesFromContext(context);
        sessionExpiry = new Date(Date.now() + 30 * 60 * 1000);

        // Save the state
        await context.storageState({ path: AUTH_STATE_PATH });
        await browser.close();

        return NextResponse.json({
          success: true,
          message: "Already authenticated",
          cookie: sessionCookies,
        });
      }

      console.log("[Browserless] Filling in email...");
      // Step 1: Enter email
      await page.fill("#input-18", process.env.NUVEQ_USERNAME || "");

      // Check "Stay signed in" checkbox
      try {
        await page.locator("#input-21").click({ force: true });
        console.log('[Browserless] Checked "Stay signed in"');
      } catch {
        console.log('[Browserless] Skipping "Stay signed in" checkbox');
      }

      console.log("[Browserless] Submitting email form...");
      await page.click('button[type="submit"]');

      // Step 2: Wait for password field
      console.log("[Browserless] Waiting for password field...");
      await page.waitForSelector('input[type="password"]', {
        timeout: 10000,
        state: "visible",
      });

      console.log("[Browserless] Filling in password...");
      await page.fill(
        'input[type="password"]',
        process.env.NUVEQ_PASSWORD || ""
      );

      console.log("[Browserless] Submitting password form...");
      await page.click('button[type="submit"]');

      // Check for OTP requirement
      console.log("[Browserless] Checking for OTP requirement...");
      await page.waitForTimeout(3000);

      // Look for OTP input fields
      // Check if we have the 6-digit OTP input fields
      const otpFields = await page.$$(
        ".otp-field-box--0, .otp-field-box--1, .otp-field-box--2, .otp-field-box--3, .otp-field-box--4, .otp-field-box--5"
      );
      const hasOtpFields = otpFields.length === 6;

      // Also check for single OTP input as fallback
      if (!hasOtpFields) {
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
            console.log(
              `[Browserless] Found single OTP input with selector: ${selector}`
            );
            break;
          }
        }
      }

      if (hasOtpFields) {
        if (!otpCode) {
          // No OTP provided, save the browser state and return
          console.log("[Browserless] OTP required - waiting for user input...");

          // Keep the browser open by not closing it
          // Store browser instance globally (temporary solution)
          global.browserlessAuthBrowser = browser;
          global.browserlessAuthPage = page;

          return NextResponse.json({
            success: false,
            requiresOTP: true,
            message:
              "OTP required. Please call /api/browserless/auth/otp with the 6-digit code",
            otpEndpoint: "/api/browserless/auth/otp",
            otpPageUrl: "/browserless-auth",
          });
        }

        console.log(
          "[Browserless] OTP required - filling in 6-digit OTP code..."
        );

        // Fill each OTP field with the corresponding digit
        for (let i = 0; i < 6; i++) {
          const selector = `.otp-field-box--${i}`;
          await page.fill(selector, otpCode[i]);
          // Small delay between each digit
          await page.waitForTimeout(100);
        }

        console.log("[Browserless] Submitting OTP...");
        // Try to submit - usually the last field triggers auto-submit
        // But also try clicking submit button if exists
        try {
          await page.click('button[type="submit"]', { timeout: 2000 });
        } catch {
          // If no submit button, the form might auto-submit
          console.log(
            "[Browserless] No submit button found, form may have auto-submitted"
          );
        }

        // Wait for navigation after OTP
        await page.waitForTimeout(5000);
      }

      // No OTP, wait for navigation
      console.log("[Browserless] No OTP required, waiting for navigation...");
      await page.waitForTimeout(3000);

      // Check if login successful
      const currentUrl = page.url();
      if (currentUrl.includes("/login")) {
        throw new Error("Login failed - still on login page");
      }

      console.log("[Browserless] Login successful!");

      // Extract cookies
      const cookies = await context.cookies();
      console.log(`[Browserless] Retrieved ${cookies.length} cookies`);

      sessionCookies = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
      sessionExpiry = new Date(Date.now() + 30 * 60 * 1000);

      // Save the browser state
      console.log("[Browserless] Saving authentication state...");
      await context.storageState({ path: AUTH_STATE_PATH });

      await browser.close();

      return NextResponse.json({
        success: true,
        message: "Authentication successful",
        cookie: sessionCookies,
        cookieCount: cookies.length,
        expiresAt: sessionExpiry.toISOString(),
      });
    } catch (innerError: unknown) {
      await browser.close();
      throw innerError;
    }
  } catch (error: unknown) {
    console.error("[Browserless] Auth error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
        error: errorMessage,
      },
      { status: 401 }
    );
  }
}
