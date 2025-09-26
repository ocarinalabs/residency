import path from "path";

export const AUTH_CONFIG = {
  STATE_PATH: path.join(process.cwd(), "auth-state.json"),
} as const;

export const TIMEOUTS = {
  NAVIGATION_MS: 30000,
  PAGE_LOAD_MS: 3000,
  TABLE_WAIT_MS: 5000,
} as const;

export const NUVEQ_ENDPOINTS = {
  BASE_URL: "https://nuveq.cloud",
  TODAY: "/visitor/todays-visitors",
  FUTURE: "/visitor/future-visitors",
  PENDING: "/visitor/pending-visitors",
} as const;

export const DEFAULT_VALUES = {
  NOT_AVAILABLE: "N/A",
  EMPTY_STRING: "",
} as const;
