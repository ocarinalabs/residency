import { getBrowserlessUrl, BrowserlessSession, BQLResponse } from "./config";
import { SESSION_CONFIG, QUERY_TIMEOUTS, NUVEQ_PATHS } from "./constants";
import fs from "fs";
import path from "path";

const AUTH_STATE_PATH = path.join(process.cwd(), "browserless-auth-state.json");

interface SessionCache {
  session: BrowserlessSession;
  createdAt: number;
  expiresAt: number;
  isAuthenticated: boolean;
}

// Singleton instance for session sharing
let sharedSessionInstance: BrowserlessSessionManager | null = null;

class BrowserlessSessionManager {
  private sessionCache: SessionCache | null = null;
  private sessionCreationLock: Promise<void> | null = null;

  private isSessionValid(): boolean {
    if (!this.sessionCache) return false;

    const now = Date.now();
    return now < this.sessionCache.expiresAt - SESSION_CONFIG.BUFFER_MS;
  }

  private async createSession(): Promise<BrowserlessSession> {
    console.log("Creating new Browserless session...");

    const url = getBrowserlessUrl("/session");

    // Retry logic for rate limits
    let retries = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    while (retries < maxRetries) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ttl: SESSION_CONFIG.LIFETIME_MS,
          stealth: SESSION_CONFIG.STEALTH_MODE,
          browser: SESSION_CONFIG.BROWSER_TYPE,
          headless: SESSION_CONFIG.HEADLESS,
          blockAds: SESSION_CONFIG.BLOCK_ADS,
        }),
      });

      if (response.status === 429) {
        retries++;
        console.log(
          `Rate limited (429). Retrying in ${retryDelay}ms... (attempt ${retries}/${maxRetries})`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * retries)
        );
        continue;
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Failed to create Browserless session: ${response.status} - ${error}`
        );
      }

      const session: BrowserlessSession = await response.json();
      console.log("Browserless session created:", session.id);
      return session;
    }

    throw new Error(
      `Failed to create session after ${maxRetries} retries due to rate limiting`
    );
  }

  private buildLoginQuery(): string {
    return `
      mutation LoginToNuveq {
        goto(url: "${NUVEQ_PATHS.BASE_URL}${NUVEQ_PATHS.LOGIN}", waitUntil: networkIdle) {
          status
        }

        waitForSelector(selector: "input[name='email']", timeout: ${QUERY_TIMEOUTS.TABLE_WAIT_MS}) {
          time
        }

        typeEmail: type(selector: "input[name='email']", text: "${process.env.NUVEQ_USERNAME}") {
          time
        }

        typePassword: type(selector: "input[name='password']", text: "${process.env.NUVEQ_PASSWORD}") {
          time
        }

        click(selector: "button[type='submit']") {
          time
        }

        checkDashboard: waitForSelector(selector: ".sidebar-menu, .navbar, .main-content", timeout: ${QUERY_TIMEOUTS.TABLE_WAIT_MS}) {
          time
        }

        cookies {
          cookies {
            name
            value
            domain
          }
        }
      }
    `;
  }

  private async executeLogin(
    session: BrowserlessSession
  ): Promise<BQLResponse> {
    const loginQuery = this.buildLoginQuery();

    const response = await fetch(session.browserQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: loginQuery }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to login to Nuveq: ${response.status} - ${error}`
      );
    }

    return await response.json();
  }

  private validateLoginResponse(result: BQLResponse): void {
    if (result.errors && result.errors.length > 0) {
      throw new Error(
        `BQL errors during login: ${JSON.stringify(result.errors)}`
      );
    }

    console.log("Successfully logged into Nuveq");
    const dataWithCookies = result.data as { cookies?: { cookies?: unknown[] } };
    console.log(`Cookies set: ${dataWithCookies.cookies?.cookies?.length || 0}`);
  }

  private async loginToNuveq(session: BrowserlessSession): Promise<void> {
    console.log("Logging into Nuveq...");
    const result = await this.executeLogin(session);
    this.validateLoginResponse(result);
  }

  async getSession(): Promise<BrowserlessSession> {
    if (this.isSessionValid() && this.sessionCache?.isAuthenticated) {
      console.log(
        "Using cached Browserless session:",
        this.sessionCache.session.id
      );
      return this.sessionCache.session;
    }

    // Prevent concurrent session creation
    if (this.sessionCreationLock) {
      console.log("Waiting for existing session creation to complete...");
      await this.sessionCreationLock;

      // Check again after waiting
      if (this.isSessionValid() && this.sessionCache?.isAuthenticated) {
        console.log(
          "Using newly created session:",
          this.sessionCache.session.id
        );
        return this.sessionCache.session;
      }
    }

    // Create lock for this session creation
    this.sessionCreationLock = this.createAndAuthenticateSession();

    try {
      await this.sessionCreationLock;
      return this.sessionCache!.session;
    } finally {
      this.sessionCreationLock = null;
    }
  }

  private async createAndAuthenticateSession(): Promise<void> {
    const session = await this.createSession();

    const now = Date.now();
    this.sessionCache = {
      session,
      createdAt: now,
      expiresAt: now + SESSION_CONFIG.LIFETIME_MS,
      isAuthenticated: false,
    };

    try {
      // Check if we have saved auth state first
      if (await this.loadExistingAuth(session)) {
        console.log("Using saved auth state from browserless-auth-state.json");
        this.sessionCache.isAuthenticated = true;
      } else {
        // Only login if no saved auth exists
        console.log("No saved auth found, logging in with credentials...");
        await this.loginToNuveq(session);
        this.sessionCache.isAuthenticated = true;
      }
    } catch (error) {
      console.error("Failed to authenticate with Nuveq:", error);
      await this.closeSession();
      throw error;
    }
  }

  private async loadExistingAuth(
    session: BrowserlessSession
  ): Promise<boolean> {
    if (!fs.existsSync(AUTH_STATE_PATH)) {
      console.log("No saved auth state file found");
      return false;
    }

    try {
      const authState = JSON.parse(fs.readFileSync(AUTH_STATE_PATH, "utf-8"));

      // Check if cookies are still valid
      const now = Date.now() / 1000;
      const hasValidCookies = authState.cookies?.some(
        (cookie: { expires: number }) =>
          cookie.expires === -1 || cookie.expires > now
      );

      if (!hasValidCookies) {
        console.log("Saved auth cookies are expired");
        return false;
      }

      // Format cookies for GraphQL (not JSON)
      const cookiesGraphQL = authState.cookies
        .map((cookie: { name: string; value: string; domain: string; path: string; expires: number; httpOnly: boolean; secure: boolean; sameSite: string }) => {
          // Escape string values properly
          const escapeValue = (str: string) =>
            str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

          return `{
          name: "${escapeValue(cookie.name)}"
          value: "${escapeValue(cookie.value)}"
          domain: "${escapeValue(cookie.domain)}"
          path: "${escapeValue(cookie.path)}"
          expires: ${cookie.expires}
          httpOnly: ${cookie.httpOnly}
          secure: ${cookie.secure}
          sameSite: "${cookie.sameSite}"
        }`;
        })
        .join(",\n        ");

      // Use BQL to set cookies from saved state
      const setCookiesQuery = `
        mutation SetCookies {
          goto(url: "${NUVEQ_PATHS.BASE_URL}", waitUntil: networkIdle) {
            status
          }

          addCookies(cookies: [
            ${cookiesGraphQL}
          ]) {
            name
            value
          }

          verifyAuth: goto(url: "${NUVEQ_PATHS.BASE_URL}/visitor/todays-visitors", waitUntil: networkIdle) {
            status
          }
        }
      `;

      const response = await fetch(session.browserQL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: setCookiesQuery }),
      });

      if (!response.ok) {
        console.log("Failed to set cookies from saved auth");
        return false;
      }

      const result = await response.json();
      if (result.errors?.length > 0) {
        console.log("BQL errors while setting cookies:", result.errors);
        return false;
      }

      console.log("Successfully loaded auth from saved state");
      return true;
    } catch (error) {
      console.error("Error loading saved auth:", error);
      return false;
    }
  }

  async executeQuery(query: string): Promise<unknown> {
    const session = await this.getSession();

    const response = await fetch(session.browserQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`BQL query failed: ${response.status} - ${error}`);
    }

    const result: BQLResponse = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(`BQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  async closeSession(): Promise<void> {
    if (!this.sessionCache) return;

    try {
      const response = await fetch(this.sessionCache.session.stop, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(
          "Browserless session closed:",
          this.sessionCache.session.id
        );
      }
    } catch (error) {
      console.error("Failed to close session:", error);
    }

    this.sessionCache = null;
  }

  getSessionInfo(): {
    hasSession: boolean;
    isValid: boolean;
    isAuthenticated: boolean;
    sessionId?: string;
    expiresIn?: number;
  } {
    const hasSession = this.sessionCache !== null;
    const isValid = this.isSessionValid();
    const isAuthenticated = this.sessionCache?.isAuthenticated || false;

    return {
      hasSession,
      isValid,
      isAuthenticated,
      sessionId: this.sessionCache?.session.id,
      expiresIn: this.sessionCache
        ? Math.max(0, this.sessionCache.expiresAt - Date.now())
        : undefined,
    };
  }
}

// Use singleton pattern to share session across all requests
export const sessionManager = (() => {
  if (!sharedSessionInstance) {
    sharedSessionInstance = new BrowserlessSessionManager();
  }
  return sharedSessionInstance;
})();
