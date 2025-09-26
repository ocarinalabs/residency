import { NextResponse } from "next/server";
import { Browser, Page } from "playwright";
import * as path from "path";

export async function POST(request: Request) {
  try {
    const { otp } = await request.json();

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { error: "Please provide a 6-digit OTP code" },
        { status: 400 }
      );
    }

    // Check if we have an active browser session waiting for OTP
    if (!global.browserlessAuthBrowser || !global.browserlessAuthPage) {
      return NextResponse.json(
        {
          error:
            "No active authentication session. Please start authentication first.",
        },
        { status: 400 }
      );
    }

    const browser = global.browserlessAuthBrowser as Browser;
    const page = global.browserlessAuthPage as Page;

    try {
      console.log("[Browserless] Filling in OTP code:", otp);

      // Fill each OTP field with the corresponding digit
      for (let i = 0; i < 6; i++) {
        const selector = `.otp-field-box--${i}`;
        await page.fill(selector, otp[i]);
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

      // Check if login successful
      const currentUrl = page.url();
      if (currentUrl.includes("/login")) {
        throw new Error("Login failed - still on login page after OTP");
      }

      console.log("[Browserless] Login successful!");

      // Extract cookies
      const context = page.context();
      const cookies = await context.cookies();
      console.log(`[Browserless] Retrieved ${cookies.length} cookies`);

      const sessionCookies = cookies
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
      const sessionExpiry = new Date(Date.now() + 30 * 60 * 1000);

      // Save the browser state
      const AUTH_STATE_PATH = path.join(
        process.cwd(),
        "browserless-auth-state.json"
      );
      console.log("[Browserless] Saving authentication state...");
      await context.storageState({ path: AUTH_STATE_PATH });

      // Close the browser now that we're done
      await browser.close();

      // Clean up global variables
      global.browserlessAuthBrowser = null;
      global.browserlessAuthPage = null;

      return NextResponse.json({
        success: true,
        message: "Authentication successful with OTP",
        cookie: sessionCookies,
        cookieCount: cookies.length,
        expiresAt: sessionExpiry.toISOString(),
      });
    } catch (innerError: unknown) {
      // Close browser on error
      await browser.close();
      global.browserlessAuthBrowser = null;
      global.browserlessAuthPage = null;
      throw innerError;
    }
  } catch (error: unknown) {
    console.error("[Browserless] OTP submission error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "OTP submission failed",
        error: errorMessage,
      },
      { status: 401 }
    );
  }
}
