export const BROWSERLESS_ENDPOINTS = {
  PRODUCTION: "https://production-sfo.browserless.io",
} as const;

export const SESSION_CONFIG = {
  LIFETIME_MS: 300000,
  BUFFER_MS: 30000,
  STEALTH_MODE: true,
  BROWSER_TYPE: "chromium" as const,
  HEADLESS: true,
  BLOCK_ADS: false,
} as const;

export const QUERY_TIMEOUTS = {
  DEFAULT_MS: 30000,
  TABLE_WAIT_MS: 10000,
  RETRY_DELAY_MS: 1000,
  MAX_RETRIES: 3,
} as const;

export const NUVEQ_PATHS = {
  BASE_URL: "https://nuveq.cloud",
  LOGIN: "/login",

  // Visitor Management
  TODAY: "/visitor/todays-visitors",
  FUTURE: "/visitor/future-visitors",
  PENDING: "/visitor/pending-visitors",
  DATABASE: "/visitor/visitor-database",
  BLACKLIST: "/visitor/visitor-blacklist",
  REPORT: "/visitor/visitor-report",
  DOORS: "/visitor/visitor-doors",
  LIFTS: "/visitor/visitor-lifts",
  SITE_SETTINGS: "/visitor/site-settings",

  // System Monitoring
  MONITORING: "/monitoring",
  DOOR_STATUS: "/door_status",
  CONTROLLER_STATUS: "/controller_status",
  INPUT_STATUS: "/input_status",

  // Access Control Configuration
  SITES: "/sites",
  CONTROLLER_GROUPS: "/controller_groups",
  CONTROLLERS: "/controllers",
  FACE_RECOGNITION: "/face_recognition_terminals",
  INTERLOCK_GROUPS: "/interlock_groups",
  SYNC: "/sync",
  INTERVALS: "/intervals",
  SCHEDULES: "/schedules",
  ACCESS_GROUPS: "/access_groups",
  LIFT_GROUPS: "/lift_groups",

  // Employee Management
  USERS: "/employee/users",
  MOBILE_USERS: "/mobile_users",
  DEPARTMENTS: "/employee/departments",
  POSITIONS: "/employee/positions",

  // Attendance & Time Tracking
  ATTENDANCE_REPORT: "/v2/attendance/report",
  ATTENDANCE_DOORS: "/v2/attendance/doors",
  ATTENDANCE_SHIFT: "/v2/attendance/shift",

  // Reports & Logs
  EVENTS: "/reports/events",
  ALARMS: "/reports/alarms",
  ALARM_EVENTS: "/reports/alarm_events",
  SYSTEM_LOGS: "/reports/system_logs",
  SILENT_CARDS: "/reports/silent_cards",
  CARD_DOORS: "/reports/card_doors",

  // System Configuration
  HOLIDAYS: "/holidays",
  EVENT_TYPES: "/event_types",
  SHIFTS: "/shifts",
  PORTAL_USERS: "/portal_users",
  ROLES: "/roles",
  NOTIFICATION_GROUPS: "/notification_groups",
  MODULES: "/modules",
  SUBSCRIPTIONS: "/v2/subscriptions",
} as const;
