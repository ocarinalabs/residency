import { BROWSERLESS_ENDPOINTS } from "./constants";

export function getBrowserlessToken(): string {
  const token = process.env.BROWSERLESS_API_TOKEN;
  if (!token) {
    throw new Error(
      "BROWSERLESS_API_TOKEN is not set in environment variables"
    );
  }
  return token;
}

export function getBrowserlessUrl(path: string): string {
  const token = getBrowserlessToken();
  return `${BROWSERLESS_ENDPOINTS.PRODUCTION}${path}?token=${token}`;
}

export interface BrowserlessSession {
  id: string;
  browserQL: string;
  connect?: string;
  stop: string;
}

export interface BQLResponse<T = unknown> {
  data: T;
  errors?: Array<{
    message: string;
    path?: string[];
  }>;
}
